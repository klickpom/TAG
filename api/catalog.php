<?php
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require __DIR__ . '/config.php';

function catalog_file(): string {
  $outside = dirname(__DIR__, 2) . '/taj-catalog.json';
  $inside = dirname(__DIR__) . '/data/catalog.json';
  $outerDir = dirname($outside);
  if (is_dir($outerDir) && (is_writable($outerDir) || is_writable($outside))) {
    return $outside;
  }
  return $inside;
}

function seed_catalog(): array {
  $seed = dirname(__DIR__) . '/data/catalog.json';
  if (!is_file($seed)) return [];
  $data = json_decode(file_get_contents($seed) ?: '[]', true);
  return is_array($data) ? $data : [];
}

function merge_seed_items(array $items): array {
  $seed = seed_catalog();
  if (!$seed) return $items;
  $byId = [];
  foreach ($seed as $row) {
    if (is_array($row) && isset($row['id'])) $byId[(string)$row['id']] = $row;
  }
  $ids = [];
  foreach ($items as &$row) {
    if (!is_array($row)) continue;
    $id = (string)($row['id'] ?? '');
    $ids[$id] = true;
    if ($id !== '' && isset($byId[$id])) {
      if (trim((string)($row['price'] ?? '')) === '' && !empty($byId[$id]['price'])) {
        $row['price'] = $byId[$id]['price'];
      }
    }
  }
  unset($row);
  foreach ($seed as $row) {
    $id = is_array($row) ? (string)($row['id'] ?? '') : '';
    if ($id !== '' && empty($ids[$id])) $items[] = $row;
  }
  return $items;
}

function read_catalog(string $file): array {
  $items = [];
  if (is_file($file)) {
    $data = json_decode(file_get_contents($file) ?: '[]', true);
    if (is_array($data)) $items = $data;
  }
  if (!$items) return seed_catalog();
  $seed = dirname(__DIR__) . '/data/catalog.json';
  if (is_file($file) && is_file($seed) && realpath($file) === realpath($seed)) return $items;
  return merge_seed_items($items);
}

function auth_ok(): bool {
  $pass = '';
  if (!empty($_POST['password'])) $pass = (string)$_POST['password'];
  $raw = file_get_contents('php://input') ?: '';
  $json = json_decode($raw, true);
  if (is_array($json) && isset($json['password'])) $pass = (string)$json['password'];
  return hash_equals(ADMIN_PASSWORD, $pass);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => true, 'items' => read_catalog(catalog_file())], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => false]);
  exit;
}

if (!empty($_FILES['image'])) {
  if (!auth_ok()) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'auth']);
    exit;
  }
  $file = $_FILES['image'];
  if (($file['error'] ?? 1) !== 0) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'upload']);
    exit;
  }
  $ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'type']);
    exit;
  }
  $dir = dirname(__DIR__) . '/images/lookbook';
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  $name = 'lb-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
  if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'move']);
    exit;
  }
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => true, 'url' => '/images/lookbook/' . $name]);
  exit;
}

header('Content-Type: application/json; charset=utf-8');
$body = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($body) || !hash_equals(ADMIN_PASSWORD, (string)($body['password'] ?? ''))) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'auth']);
  exit;
}

if (($body['action'] ?? '') === 'login') {
  echo json_encode(['ok' => true]);
  exit;
}

$items = $body['items'] ?? [];
if (!is_array($items)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'items']);
  exit;
}

$clean = [];
foreach ($items as $row) {
  if (!is_array($row)) continue;
  $id = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($row['id'] ?? '')) ?? '';
  $name = trim(mb_substr((string)($row['name'] ?? ''), 0, 140));
  $image = trim((string)($row['image'] ?? ''));
  $kind = ($row['kind'] ?? '') === 'clocks' ? 'clocks' : 'pots';
  $size = trim(mb_substr((string)($row['size'] ?? ''), 0, 80));
  $price = trim(mb_substr((string)($row['price'] ?? ''), 0, 40));
  if ($id === '' || $name === '' || $image === '') continue;
  if (!preg_match('#^(/images/|https?://)#', $image)) continue;
  $clean[] = compact('id', 'name', 'image', 'kind', 'size', 'price');
}

$file = catalog_file();
$dir = dirname($file);
if (!is_dir($dir)) mkdir($dir, 0755, true);
file_put_contents($file, json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
echo json_encode(['ok' => true, 'count' => count($clean)], JSON_UNESCAPED_UNICODE);
