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

function public_upload_dirs(): array {
  $dirs = [
    dirname(__DIR__) . '/images/lookbook',
    dirname(__DIR__) . '/images/catalog',
  ];
  foreach ($dirs as $dir) {
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
  }
  return $dirs;
}

function public_upload_dir(): string {
  $dirs = public_upload_dirs();
  return $dirs[0];
}

function seed_catalog(): array {
  $seed = dirname(__DIR__) . '/data/catalog.json';
  if (!is_file($seed)) return [];
  $data = json_decode(file_get_contents($seed) ?: '[]', true);
  return is_array($data) ? $data : [];
}

function image_filename(string $image): string {
  $query = parse_url($image, PHP_URL_QUERY);
  if (is_string($query) && $query !== '') {
    parse_str($query, $params);
    if (!empty($params['f'])) {
      $image = (string)$params['f'];
    }
  }
  $path = parse_url($image, PHP_URL_PATH);
  $file = basename(is_string($path) && $path !== '' ? $path : $image);
  return preg_replace('/[^a-zA-Z0-9._-]/', '', $file) ?? '';
}

function is_dated_upload_name(string $file): bool {
  return (bool)preg_match('/^lb-\d{8}/', $file);
}

function is_admin_upload_url(string $image): bool {
  $image = trim($image);
  if ($image === '') return false;
  if (strpos($image, '/api/media.php') !== false) return true;
  if (strpos($image, '/images/catalog/') !== false) return true;
  return is_dated_upload_name(image_filename($image));
}

function catalog_has_admin_uploads(array $items): bool {
  foreach ($items as $row) {
    if (!is_array($row)) continue;
    if (is_admin_upload_url((string)($row['image'] ?? ''))) return true;
  }
  return false;
}

function upload_search_dirs(): array {
  return array_values(array_unique(array_filter([
    durable_upload_dir(),
    dirname(__DIR__) . '/data/uploads',
    dirname(__DIR__) . '/images/lookbook',
    dirname(__DIR__) . '/images/catalog',
  ])));
}

function find_upload_path(string $file): ?string {
  if ($file === '') return null;
  foreach (upload_search_dirs() as $dir) {
    $try = $dir . DIRECTORY_SEPARATOR . $file;
    if (is_file($try)) return $try;
  }
  return null;
}

function media_url(string $file): string {
  return '/api/media.php?f=' . rawurlencode($file);
}

function republish_upload(string $file): void {
  $src = find_upload_path($file);
  if ($src === null) return;
  $durable = durable_upload_dir() . '/' . $file;
  if ($src !== $durable) @copy($src, $durable);
  foreach (public_upload_dirs() as $dir) {
    $dest = $dir . '/' . $file;
    if (!is_file($dest)) @copy($src, $dest);
  }
}

function list_admin_upload_files(): array {
  $seen = [];
  $out = [];
  foreach (upload_search_dirs() as $dir) {
    if (!is_dir($dir)) continue;
    $files = @scandir($dir);
    if (!is_array($files)) continue;
    foreach ($files as $file) {
      if ($file === '.' || $file === '..' || isset($seen[$file])) continue;
      if (!is_dated_upload_name($file)) continue;
      $path = $dir . '/' . $file;
      if (!is_file($path)) continue;
      $seen[$file] = true;
      republish_upload($file);
      $out[] = [
        'file' => $file,
        'url' => media_url($file),
        'mtime' => (int)filemtime($path),
        'size' => (int)filesize($path),
      ];
    }
  }
  usort($out, function ($a, $b) {
    return ($a['mtime'] <=> $b['mtime']);
  });
  return $out;
}

function backup_paths(string $file): array {
  $dir = dirname($file);
  $base = basename($file);
  $paths = glob($dir . '/' . $base . '.bak*') ?: [];
  $paths = array_merge($paths, glob($dir . '/taj-catalog.json.bak*') ?: []);
  $paths = array_merge($paths, glob(dirname(__DIR__) . '/data/taj-catalog.json.bak*') ?: []);
  $paths = array_values(array_unique($paths));
  usort($paths, function ($a, $b) {
    return (filemtime($b) ?: 0) <=> (filemtime($a) ?: 0);
  });
  return $paths;
}

function find_restorable_catalog(string $file): ?array {
  foreach (backup_paths($file) as $path) {
    if (!is_file($path)) continue;
    $data = json_decode(file_get_contents($path) ?: '[]', true);
    if (is_array($data) && catalog_has_admin_uploads($data)) return $data;
  }
  return null;
}

function persist_catalog(string $file, array $items): void {
  $dir = dirname($file);
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  if (is_file($file)) {
    $prev = json_decode(file_get_contents($file) ?: '[]', true);
    if (is_array($prev) && catalog_has_admin_uploads($prev)) {
      @copy($file, $file . '.bak');
      @copy($file, $file . '.bak-' . date('YmdHis'));
      $old = backup_paths($file);
      foreach (array_slice($old, 30) as $stale) {
        if (preg_match('/\.bak-\d{14}$/', $stale)) @unlink($stale);
      }
    }
  }
  file_put_contents($file, json_encode($items, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function heal_images(array $items): array {
  $seed = seed_catalog();
  $byId = [];
  foreach ($seed as $row) {
    if (is_array($row) && isset($row['id'])) $byId[(string)$row['id']] = $row;
  }
  foreach ($items as &$row) {
    if (!is_array($row)) continue;
    $image = trim((string)($row['image'] ?? ''));
    $id = (string)($row['id'] ?? '');
    $fallback = is_array($byId[$id] ?? null) ? (string)($byId[$id]['image'] ?? '') : '';
    $admin = is_admin_upload_url($image);
    if ($image === '' || strpos($image, 'blob:') === 0 || strpos($image, 'data:') === 0) {
      if (!$admin && $fallback !== '') $row['image'] = $fallback;
      continue;
    }
    $file = image_filename($image);
    if ($file === '') {
      if (!$admin && $fallback !== '') $row['image'] = $fallback;
      continue;
    }
    if ($admin || is_dated_upload_name($file)) {
      republish_upload($file);
      if (find_upload_path($file) !== null) {
        $row['image'] = media_url($file);
      }
      continue;
    }
    $found = find_upload_path($file);
    if ($found !== null) {
      republish_upload($file);
      $row['image'] = is_dated_upload_name($file) ? media_url($file) : '/images/lookbook/' . $file;
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

function decode_items($data): array {
  if (!is_array($data)) return [];
  $items = [];
  foreach ($data as $row) {
    if (is_array($row)) $items[] = $row;
  }
  return $items;
}

function read_catalog(string $file): array {
  $items = [];
  if (is_file($file)) {
    $items = decode_items(json_decode(file_get_contents($file) ?: '[]', true));
  }

  if (!catalog_has_admin_uploads($items)) {
    $restored = find_restorable_catalog($file);
    if (is_array($restored) && catalog_has_admin_uploads($restored)) {
      persist_catalog($file, $restored);
      $items = $restored;
    }
  }

  if (!$items) {
    $items = seed_catalog();
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
  $saved = @copy($tmp, $durable);
  if (!$saved) $saved = @move_uploaded_file($tmp, $durable);
  if (!$saved) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'move']);
    exit;
  }
  republish_upload($name);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => true, 'url' => media_url($name)]);
  exit;
}

header('Content-Type: application/json; charset=utf-8');
$body = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($body) || !hash_equals(ADMIN_PASSWORD, (string)($body['password'] ?? ''))) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'auth']);
  exit;
}

$action = (string)($body['action'] ?? 'save');

if ($action === 'login') {
  echo json_encode(['ok' => true]);
  exit;
}

if ($action === 'uploads') {
  $current = [];
  $file = catalog_file();
  if (is_file($file)) {
    $current = decode_items(json_decode(file_get_contents($file) ?: '[]', true));
  }
  echo json_encode([
    'ok' => true,
    'files' => list_admin_upload_files(),
    'hasUploads' => catalog_has_admin_uploads($current),
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($action === 'restore') {
  $file = catalog_file();
  $restored = find_restorable_catalog($file);
  if (!is_array($restored) || !catalog_has_admin_uploads($restored)) {
    echo json_encode([
      'ok' => false,
      'error' => 'no_backup',
      'files' => list_admin_upload_files(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
  }
  persist_catalog($file, $restored);
  echo json_encode([
    'ok' => true,
    'count' => count($restored),
    'source' => 'backup',
  ], JSON_UNESCAPED_UNICODE);
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
persist_catalog(catalog_file(), $clean);
echo json_encode(['ok' => true, 'count' => count($clean)], JSON_UNESCAPED_UNICODE);
