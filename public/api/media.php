<?php
$f = (string)($_GET['f'] ?? '');
if (!preg_match('/^[a-zA-Z0-9._-]+$/', $f)) {
  http_response_code(400);
  exit;
}

$dirs = [
  dirname(__DIR__, 2) . '/taj-uploads',
  dirname(__DIR__) . '/data/uploads',
  dirname(__DIR__) . '/images/lookbook',
  dirname(__DIR__) . '/images/catalog',
];

$path = null;
foreach ($dirs as $dir) {
  $try = $dir . DIRECTORY_SEPARATOR . $f;
  if (is_file($try)) {
    $path = $try;
    break;
  }
}

if ($path === null) {
  http_response_code(404);
  exit;
}

$ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
$types = [
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'jfif' => 'image/jpeg',
  'png' => 'image/png',
  'webp' => 'image/webp',
  'gif' => 'image/gif',
];

header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: public, max-age=31536000, immutable');
header('Content-Length: ' . (string)filesize($path));
readfile($path);
