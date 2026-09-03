<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require __DIR__ . '/config.php';

$file = dirname(__DIR__) . '/data/product-names.json';

function read_names(string $file): array {
  if (!is_file($file)) return [];
  $raw = file_get_contents($file);
  $data = json_decode($raw ?: '{}', true);
  return is_array($data) ? $data : [];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo json_encode(read_names($file), JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

$body = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($body)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'json']);
  exit;
}

$pass = (string)($body['password'] ?? '');
if (!hash_equals(ADMIN_PASSWORD, $pass)) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'auth']);
  exit;
}

$action = (string)($body['action'] ?? 'save');
if ($action === 'login') {
  echo json_encode(['ok' => true]);
  exit;
}

$names = $body['names'] ?? [];
if (!is_array($names)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'names']);
  exit;
}

$clean = [];
foreach ($names as $id => $name) {
  if (!is_string($id) || !is_string($name)) continue;
  $id = preg_replace('/[^a-zA-Z0-9]/', '', $id) ?? '';
  $name = trim(mb_substr($name, 0, 140));
  if ($id !== '' && $name !== '') $clean[$id] = $name;
}

$dir = dirname($file);
if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'dir']);
  exit;
}

$ok = file_put_contents(
  $file,
  json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
  LOCK_EX
);
if ($ok === false) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'write']);
  exit;
}

echo json_encode(['ok' => true, 'count' => count($clean)], JSON_UNESCAPED_UNICODE);
