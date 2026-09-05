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

function durable_upload_dir(): string {
  $outside = dirname(__DIR__, 2) . '/taj-uploads';
  $outerDir = dirname($outside);
  if (is_dir($outerDir) && (is_writable($outerDir) || is_dir($outside) || is_writable($outside))) {
    if (!is_dir($outside)) @mkdir($outside, 0755, true);
    if (is_dir($outside) && is_writable($outside)) return $outside;
  }
  $inside = dirname(__DIR__) . '/data/uploads';
  if (!is_dir($inside)) @mkdir($inside, 0755, true);
  return $inside;
}

function public_upload_dir(): string {
  $dir = dirname(__DIR__) . '/images/lookbook';
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  return $dir;
}

function seed_catalog(): array {
  $seed = dirname(__DIR__) . '/data/catalog.json';
  if (!is_file($seed)) return [];
  $data = json_decode(file_get_contents($seed) ?: '[]', true);
  return is_array($data) ? $data : [];
}

function image_filename(string $image): string {
  $path = parse_url($image, PHP_URL_PATH);
  $file = basename(is_string($path) && $path !== '' ? $path : $image);
  return preg_replace('/[^a-zA-Z0-9._-]/', '', $file) ?? '';
}

function heal_images(array $items): array {
  $seed = seed_catalog();
  $byId = [];
  foreach ($seed as $row) {
    if (is_array($row) && isset($row['id'])) $byId[(string)$row['id']] = $row;
  }
  $publicDir = public_upload_dir();
  $durableDir = durable_upload_dir();
  foreach ($items as &$row) {
    if (!is_array($row)) continue;
    $image = trim((string)($row['image'] ?? ''));
    $id = (string)($row['id'] ?? '');
    $fallback = is_array($byId[$id] ?? null) ? (string)($byId[$id]['image'] ?? '') : '';
    if ($image === '' || strpos($image, 'blob:') === 0 || strpos($image, 'data:') === 0) {
      if ($fallback !== '') $row['image'] = $fallback;
      continue;
    }
    $file = image_filename($image);
    if ($file === '') {
      if ($fallback !== '') $row['image'] = $fallback;
      continue;
    }
    $pub = $publicDir . '/' . $file;
    $dur = $durableDir . '/' . $file;
    if (is_file($dur) && !is_file($pub)) {
      @copy($dur, $pub);
    }
    if (is_file($pub)) {
      $row['image'] = '/images/lookbook/' . $file;
      continue;
    }
    if (is_file($dur)) {
      $row['image'] = '/api/media.php?f=' . rawurlencode($file);
      continue;
    }
    if ($fallback !== '') $row['image'] = $fallback;
  }
  unset($row);
  return $items;
}

function sort_catalog_items(array $items): array {
  $clocks = [];
  $decor = [];
  foreach ($items as $row) {
    if (is_array($row) && (($row['kind'] ?? '') === 'clocks')) $clocks[] = $row;
    else $decor[] = $row;
  }
  return array_merge($clocks, $decor);
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

function is_factory_catalog(array $items): bool {
  foreach ($items as $row) {
    if (is_array($row) && (string)($row['id'] ?? '') === 'lb04') return true;
  }
  return false;
}

function read_catalog(string $file): array {
  $items = [];
  if (is_file($file)) {
    $data = json_decode(file_get_contents($file) ?: '[]', true);
    if (is_array($data)) $items = $data;
  }
  $seedItems = sort_catalog_items(heal_images(seed_catalog()));
  if (!$items || !is_factory_catalog($items)) {
    $dir = dirname($file);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    @file_put_contents($file, json_encode($seedItems, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    return $seedItems;
  }
  $seed = dirname(__DIR__) . '/data/catalog.json';
  if (is_file($file) && is_file($seed) && realpath($file) === realpath($seed)) {
    return sort_catalog_items(heal_images($items));
  }
  return sort_catalog_items(heal_images(merge_seed_items($items)));
}

function auth_ok(): bool {
  $pass = '';
  if (!empty($_POST['password'])) $pass = (string)$_POST['password'];
  $raw = file_get_contents('php://input') ?: '';
  $json = json_decode($raw, true);
  if (is_array($json) && isset($json['password'])) $pass = (string)$json['password'];
  return hash_equals(ADMIN_PASSWORD, $pass);
}

function sniff_ext(array $file): ?string {
  $ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
  if ($ext === 'jfif' || $ext === 'jpeg') $ext = 'jpg';
  $ok = ['jpg' => true, 'png' => true, 'webp' => true, 'gif' => true];
  if (isset($ok[$ext])) return $ext;
  $mime = (string)($file['type'] ?? '');
  if (class_exists('finfo') && is_file((string)$file['tmp_name'])) {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string)$finfo->file((string)$file['tmp_name']);
  }
  $fromMime = [
    'image/jpeg' => 'jpg',
    'image/pjpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
  ];
  return $fromMime[$mime] ?? null;
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
  $code = (int)($file['error'] ?? 1);
  if ($code !== 0) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $code === 1 || $code === 2 ? 'too_big' : 'upload']);
    exit;
  }
  $ext = sniff_ext($file);
  if ($ext === null) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'type']);
    exit;
  }
  $name = 'lb-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
  $tmp = (string)$file['tmp_name'];
  $durable = durable_upload_dir() . '/' . $name;
  $public = public_upload_dir() . '/' . $name;
  $saved = @copy($tmp, $durable);
  if (!$saved) $saved = @move_uploaded_file($tmp, $durable);
  if (!$saved) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'move']);
    exit;
  }
  @copy($durable, $public);
  $url = is_file($public)
    ? '/images/lookbook/' . $name
    : '/api/media.php?f=' . rawurlencode($name);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => true, 'url' => $url]);
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
  if (strpos($image, 'blob:') === 0 || strpos($image, 'data:') === 0) continue;
  if (!preg_match('#^(/images/|/api/media\.php\?f=|https?://)#', $image)) continue;
  $clean[] = compact('id', 'name', 'image', 'kind', 'size', 'price');
}

$clean = sort_catalog_items($clean);

$file = catalog_file();
$dir = dirname($file);
if (!is_dir($dir)) mkdir($dir, 0755, true);
file_put_contents($file, json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
echo json_encode(['ok' => true, 'count' => count($clean)], JSON_UNESCAPED_UNICODE);
