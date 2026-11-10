// Cloudflare Pages Function — replaces Hostinger's api/*.php and .htaccess for tag-eg.online.
//
// Bindings (Pages > Settings):
//   DB              D1 database: catalog JSON, product names, catalog backups, upload index.
//   MEDIA           KV namespace: admin-uploaded images (key = file name).
//   ADMIN_PASSWORD  Secret. Same password the admin panel uses (was api/config.php).
//   SEED_SOURCE     Migration only, e.g. https://tag-eg.online — remove after cutover.

import { STATIC_UPLOAD_FILES } from './_static-files.js';

const LINK_HEADER = '<https://tag-eg.online/llms.txt>; rel="alternate"; type="text/plain"; title="LLM facts"';
const NO_CACHE_HTML = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  Link: LINK_HEADER,
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const segs = path.split('/');

  // Dotfiles and the private data folder were denied by Apache
  if (segs.some((s) => s.startsWith('.') && s.length > 1) || path === '/data' || path.startsWith('/data/')) {
    return new Response(FORBIDDEN_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8', Link: LINK_HEADER } });
  }

  if (path === '/api/catalog.php') return catalogApi(request, env, url);
  if (path === '/api/products.php') return productsApi(request, env);
  if (path === '/api/media.php') return mediaApi(env, url);
  if (path === '/api/config.php') return new Response('', { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8', Link: LINK_HEADER } });

  // Never serve PHP source (public/api/*.php, etc.)
  if (/\.php$/i.test(path) || path.startsWith('/api/')) {
    return new Response('', { status: 404, headers: { Link: LINK_HEADER } });
  }

  // /admin → index.html, noindex
  if (path === '/admin' || path.startsWith('/admin/')) {
    const r = await env.ASSETS.fetch(new Request(url.origin + '/'));
    return new Response(request.method === 'HEAD' ? null : await r.text(), {
      status: 200,
      headers: { ...NO_CACHE_HTML, 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  // Apache served these directly (Pages would 308-redirect them)
  if (path === '/index.html') {
    const r = await env.ASSETS.fetch(new Request(url.origin + '/'));
    return new Response(request.method === 'HEAD' ? null : await r.text(), { status: 200, headers: NO_CACHE_HTML });
  }

  // /catalog → catalog.html
  if (path === '/catalog' || path === '/catalog/' || path === '/catalog.html') {
    const r = await env.ASSETS.fetch(new Request(url.origin + '/catalog.html'));
    return new Response(request.method === 'HEAD' ? null : await r.text(), { status: 200, headers: NO_CACHE_HTML });
  }

  // Uploaded images were also republished under /images/lookbook and /images/catalog
  const m = path.match(/^\/images\/(lookbook|catalog)\/([a-zA-Z0-9._-]+)$/);
  if (m && env.MEDIA) {
    const hit = await mediaResponse(env, m[2]);
    if (hit) return hit;
  }

  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set('Link', LINK_HEADER);
  const ct = out.headers.get('Content-Type') || '';
  if (ct.startsWith('text/html')) {
    out.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    out.headers.set('Pragma', 'no-cache');
    out.headers.set('Expires', '0');
  }
  return out;
}

const FORBIDDEN_HTML = '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Forbidden</h1></body></html>';

/* ------------------------------------------------------------------ */
/* helpers (PHP semantics)                                             */
/* ------------------------------------------------------------------ */

const isArr = (v) => v !== null && typeof v === 'object';
const vals = (v) => (Array.isArray(v) ? v : Object.values(v));
const str = (v) => (v === null || v === undefined || v === false ? '' : v === true ? '1' : typeof v === 'object' ? 'Array' : String(v));
const phpTrim = (s) => s.replace(/^[ \t\n\r\0\x0B]+|[ \t\n\r\0\x0B]+$/g, '');
const mbSub = (s, n) => [...s].slice(0, n).join('');

function jsonRes(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Link: LINK_HEADER, ...extra },
  });
}

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS catalog_backups (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, value TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS media (name TEXT PRIMARY KEY, mtime INTEGER NOT NULL, size INTEGER NOT NULL, type TEXT)'),
  ]);
  schemaReady = true;
}

async function getKey(db, key) {
  await ensureSchema(db);
  const row = await db.prepare('SELECT value FROM store WHERE key = ?').bind(key).first();
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}

async function setKey(db, key, value) {
  await ensureSchema(db);
  await db
    .prepare('INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(key, JSON.stringify(value))
    .run();
}

/* ------------------------------------------------------------------ */
/* catalog.php                                                         */
/* ------------------------------------------------------------------ */

let seedCache = null;
async function seedCatalog(env, origin) {
  if (seedCache) return seedCache;
  try {
    const r = await env.ASSETS.fetch(new Request(origin + '/data/catalog.json'));
    const d = r.ok ? await r.json() : [];
    seedCache = Array.isArray(d) || isArr(d) ? vals(d) : [];
  } catch {
    seedCache = [];
  }
  return seedCache;
}

// PHP: parse_url ?f= → basename(path) → strip unsafe chars
function imageFilename(image) {
  let img = image;
  const q = img.indexOf('?');
  if (q !== -1) {
    const f = new URLSearchParams(img.slice(q + 1).split('#')[0]).get('f');
    if (f) img = f;
  }
  const abs = img.match(/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*([^?#]*)/i);
  const path = abs ? abs[1] : img.split(/[?#]/)[0];
  const base = (path !== '' ? path : img).replace(/\/+$/, '').split('/').pop() || '';
  return base.replace(/[^a-zA-Z0-9._-]/g, '');
}

const isDatedUploadName = (f) => /^lb-\d{8}/.test(f);

function isAdminUploadUrl(image) {
  const img = phpTrim(image);
  if (img === '') return false;
  if (img.includes('/api/media.php')) return true;
  if (img.includes('/images/catalog/')) return true;
  return isDatedUploadName(imageFilename(img));
}

function catalogHasAdminUploads(items) {
  for (const row of items) {
    if (!isArr(row)) continue;
    if (isAdminUploadUrl(str(row.image))) return true;
  }
  return false;
}

const mediaUrl = (file) => '/api/media.php?f=' + encodeURIComponent(file);

async function uploadedNames(db) {
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT name FROM media').all();
  return new Set(results.map((r) => r.name));
}

function decodeItems(data) {
  if (!isArr(data)) return [];
  return vals(data).filter(isArr);
}

function sortCatalogItems(items) {
  const clocks = [];
  const decor = [];
  for (const row of items) {
    if (isArr(row) && row.kind === 'clocks') clocks.push(row);
    else decor.push(row);
  }
  return [...clocks, ...decor];
}

function mergeSeedItems(items, seed) {
  if (!seed.length) return items;
  const byId = new Map();
  for (const row of seed) if (isArr(row) && row.id !== undefined) byId.set(str(row.id), row);
  const ids = new Set();
  for (const row of items) {
    if (!isArr(row)) continue;
    const id = str(row.id);
    ids.add(id);
    if (id !== '' && byId.has(id)) {
      if (phpTrim(str(row.price)) === '' && byId.get(id).price) row.price = byId.get(id).price;
    }
  }
  for (const row of seed) {
    const id = isArr(row) ? str(row.id) : '';
    if (id !== '' && !ids.has(id)) items.push(row);
  }
  return items;
}

function healImages(items, seed, uploaded) {
  const byId = new Map();
  for (const row of seed) if (isArr(row) && row.id !== undefined) byId.set(str(row.id), row);
  const exists = (f) => f !== '' && (uploaded.has(f) || STATIC_UPLOAD_FILES.has(f));
  for (const row of items) {
    if (!isArr(row)) continue;
    const image = phpTrim(str(row.image));
    const id = str(row.id);
    const fallback = isArr(byId.get(id)) ? str(byId.get(id).image) : '';
    const admin = isAdminUploadUrl(image);
    if (image === '' || image.startsWith('blob:') || image.startsWith('data:')) {
      if (!admin && fallback !== '') row.image = fallback;
      continue;
    }
    const file = imageFilename(image);
    if (file === '') {
      if (!admin && fallback !== '') row.image = fallback;
      continue;
    }
    if (admin || isDatedUploadName(file)) {
      if (exists(file)) row.image = mediaUrl(file);
      continue;
    }
    if (exists(file)) {
      row.image = isDatedUploadName(file) ? mediaUrl(file) : '/images/lookbook/' + file;
      continue;
    }
    if (fallback !== '') row.image = fallback;
  }
  return items;
}

async function findRestorableCatalog(db) {
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT value FROM catalog_backups ORDER BY ts DESC, id DESC LIMIT 30').all();
  for (const r of results) {
    try {
      const d = JSON.parse(r.value);
      if (isArr(d) && catalogHasAdminUploads(vals(d))) return vals(d);
    } catch {}
  }
  return null;
}

async function persistCatalog(db, items) {
  const prev = await getKey(db, 'catalog');
  if (isArr(prev) && catalogHasAdminUploads(vals(prev))) {
    await db.prepare('INSERT INTO catalog_backups (ts, value) VALUES (?, ?)').bind(Date.now(), JSON.stringify(prev)).run();
    await db
      .prepare('DELETE FROM catalog_backups WHERE id NOT IN (SELECT id FROM catalog_backups ORDER BY ts DESC, id DESC LIMIT 30)')
      .run();
  }
  await setKey(db, 'catalog', items);
}

async function readCatalog(env, origin) {
  const db = env.DB;
  let items = decodeItems(await getKey(db, 'catalog'));
  if (!catalogHasAdminUploads(items)) {
    const restored = await findRestorableCatalog(db);
    if (restored && catalogHasAdminUploads(restored)) {
      await persistCatalog(db, restored);
      items = restored;
    }
  }
  const seed = await seedCatalog(env, origin);
  if (!items.length) items = JSON.parse(JSON.stringify(seed));
  const uploaded = await uploadedNames(db);
  return sortCatalogItems(healImages(mergeSeedItems(items, seed), seed, uploaded));
}

async function listAdminUploadFiles(db) {
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT name, mtime, size FROM media ORDER BY mtime ASC, name ASC').all();
  return results
    .filter((r) => isDatedUploadName(r.name))
    .map((r) => ({ file: r.name, url: mediaUrl(r.name), mtime: r.mtime, size: r.size }));
}

const EXT_OK = new Set(['jpg', 'png', 'webp', 'gif']);
const MIME_EXT = { 'image/jpeg': 'jpg', 'image/pjpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const EXT_MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

function sniffExt(file, bytes) {
  let ext = (file.name || '').includes('.') ? file.name.split('.').pop().toLowerCase() : '';
  if (ext === 'jfif' || ext === 'jpeg') ext = 'jpg';
  if (EXT_OK.has(ext)) return ext;
  const b = bytes;
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'gif';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return 'webp';
  return MIME_EXT[file.type] || null;
}

function cairoStamp() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value])
  );
  return p.year + p.month + p.day + p.hour + p.minute + p.second;
}

function nameToMtime(name) {
  const m = name.match(/^lb-(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!m) return Math.floor(Date.now() / 1000);
  return Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 2, +m[5], +m[6]) / 1000);
}

async function storeMedia(env, name, bytes, type, mtime) {
  await env.MEDIA.put(name, bytes, { metadata: { type } });
  await ensureSchema(env.DB);
  await env.DB
    .prepare('INSERT INTO media (name, mtime, size, type) VALUES (?, ?, ?, ?) ON CONFLICT(name) DO UPDATE SET mtime = excluded.mtime, size = excluded.size, type = excluded.type')
    .bind(name, mtime, bytes.byteLength, type)
    .run();
}

const passOk = (env, pass) => {
  const want = String(env.ADMIN_PASSWORD || '');
  return want !== '' && timingSafeEqual(want, str(pass));
};

function timingSafeEqual(a, b) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] || 0) ^ (eb[i] || 0);
  return diff === 0;
}

async function catalogApi(request, env, url) {
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store', Link: LINK_HEADER } });
  if (!env.DB || !env.MEDIA) return jsonRes({ ok: false, error: 'config' }, 500);

  if (method === 'GET') {
    return jsonRes({ ok: true, items: await readCatalog(env, url.origin) });
  }
  if (method !== 'POST') return jsonRes({ ok: false }, 405);

  const ctype = request.headers.get('Content-Type') || '';

  // Image upload (multipart)
  if (ctype.includes('multipart/form-data')) {
    let form;
    try {
      form = await request.formData();
    } catch {
      form = null;
    }
    const file = form && form.get('image');
    if (file && typeof file === 'object') {
      if (!passOk(env, form.get('password') || '')) return jsonRes({ ok: false, error: 'auth' }, 401);
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes.byteLength === 0) return jsonRes({ ok: false, error: 'upload' }, 400);
      if (bytes.byteLength > 20 * 1024 * 1024) return jsonRes({ ok: false, error: 'too_big' }, 400);
      const ext = sniffExt(file, bytes);
      if (!ext) return jsonRes({ ok: false, error: 'type' }, 400);
      const rnd = [...crypto.getRandomValues(new Uint8Array(3))].map((x) => x.toString(16).padStart(2, '0')).join('');
      const name = 'lb-' + cairoStamp() + '-' + rnd + '.' + ext;
      try {
        await storeMedia(env, name, bytes, EXT_MIME[ext], Math.floor(Date.now() / 1000));
      } catch {
        return jsonRes({ ok: false, error: 'move' }, 500);
      }
      return jsonRes({ ok: true, url: mediaUrl(name) });
    }
    return jsonRes({ ok: false, error: 'auth' }, 401);
  }

  let body;
  try {
    body = JSON.parse((await request.text()) || '{}');
  } catch {
    body = null;
  }

  // Migration only (no password; active only while SEED_SOURCE is set)
  if (isArr(body) && body.action === 'sync-from-source') return syncFromSource(env, url.origin, body);

  if (!isArr(body) || !passOk(env, body.password ?? '')) return jsonRes({ ok: false, error: 'auth' }, 401);

  const action = str(body.action ?? 'save');
  const db = env.DB;

  if (action === 'login') return jsonRes({ ok: true });

  if (action === 'uploads') {
    const current = decodeItems(await getKey(db, 'catalog'));
    return jsonRes({ ok: true, files: await listAdminUploadFiles(db), hasUploads: catalogHasAdminUploads(current) });
  }

  if (action === 'restore') {
    const restored = await findRestorableCatalog(db);
    if (!restored || !catalogHasAdminUploads(restored)) {
      return jsonRes({ ok: false, error: 'no_backup', files: await listAdminUploadFiles(db) });
    }
    await persistCatalog(db, restored);
    return jsonRes({ ok: true, count: restored.length, source: 'backup' });
  }

  const items = body.items ?? [];
  if (!isArr(items)) return jsonRes({ ok: false, error: 'items' }, 400);

  const clean = [];
  for (const row of vals(items)) {
    if (!isArr(row)) continue;
    const id = str(row.id).replace(/[^a-zA-Z0-9_-]/g, '');
    const name = phpTrim(mbSub(str(row.name), 140));
    const image = phpTrim(str(row.image));
    const kind = row.kind === 'clocks' ? 'clocks' : 'pots';
    const size = phpTrim(mbSub(str(row.size), 80));
    const price = phpTrim(mbSub(str(row.price), 40));
    if (id === '' || name === '' || image === '') continue;
    if (image.startsWith('blob:') || image.startsWith('data:')) continue;
    if (!/^(\/images\/|\/api\/media\.php\?f=|https?:\/\/)/.test(image)) continue;
    clean.push({ id, name, image, kind, size, price });
  }
  const sorted = sortCatalogItems(clean);
  await persistCatalog(db, sorted);
  return jsonRes({ ok: true, count: sorted.length });
}

/* ------------------------------------------------------------------ */
/* products.php                                                        */
/* ------------------------------------------------------------------ */

async function productsApi(request, env) {
  const h = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Link: LINK_HEADER };
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
  if (!env.DB) return jsonRes({ ok: false, error: 'config' }, 500);

  if (method === 'GET') {
    const names = await getKey(env.DB, 'names');
    const out = isArr(names) && Object.keys(names).length ? names : [];
    return new Response(JSON.stringify(out), { status: 200, headers: h });
  }
  if (method !== 'POST') return jsonRes({ ok: false, error: 'method' }, 405);

  let body;
  try {
    body = JSON.parse((await request.text()) || '{}');
  } catch {
    body = null;
  }
  if (!isArr(body)) return jsonRes({ ok: false, error: 'json' }, 400);
  if (!passOk(env, body.password ?? '')) return jsonRes({ ok: false, error: 'auth' }, 401);

  const action = str(body.action ?? 'save');
  if (action === 'login') return jsonRes({ ok: true });

  const names = body.names ?? [];
  if (!isArr(names)) return jsonRes({ ok: false, error: 'names' }, 400);

  const clean = {};
  if (!Array.isArray(names)) {
    for (const [rawId, rawName] of Object.entries(names)) {
      if (/^(0|[1-9]\d*)$/.test(rawId) || typeof rawName !== 'string') continue; // PHP turns numeric keys into ints
      const id = rawId.replace(/[^a-zA-Z0-9]/g, '');
      const name = phpTrim(mbSub(rawName, 140));
      if (id !== '' && name !== '') clean[id] = name;
    }
  }
  try {
    await setKey(env.DB, 'names', clean);
  } catch {
    return jsonRes({ ok: false, error: 'write' }, 500);
  }
  return jsonRes({ ok: true, count: Object.keys(clean).length });
}

/* ------------------------------------------------------------------ */
/* media.php                                                           */
/* ------------------------------------------------------------------ */

async function mediaResponse(env, f) {
  const obj = await env.MEDIA.getWithMetadata(f, { type: 'arrayBuffer' });
  if (!obj || obj.value === null) return null;
  const ext = f.includes('.') ? f.split('.').pop().toLowerCase() : '';
  return new Response(obj.value, {
    status: 200,
    headers: {
      'Content-Type': EXT_MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(obj.value.byteLength),
      Link: LINK_HEADER,
    },
  });
}

async function mediaApi(env, url) {
  const f = url.searchParams.get('f') || '';
  if (!/^[a-zA-Z0-9._-]+$/.test(f)) return new Response('', { status: 400, headers: { Link: LINK_HEADER } });
  if (env.MEDIA) {
    const hit = await mediaResponse(env, f);
    if (hit) return hit;
  }
  for (const dir of ['lookbook', 'catalog']) {
    if (STATIC_UPLOAD_FILES.has(f)) {
      const r = await env.ASSETS.fetch(new Request(url.origin + '/images/' + dir + '/' + f));
      const ct = r.headers.get('Content-Type') || '';
      if (r.ok && !ct.startsWith('text/html')) {
        const ext = f.split('.').pop().toLowerCase();
        return new Response(r.body, {
          status: 200,
          headers: {
            'Content-Type': EXT_MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
            Link: LINK_HEADER,
          },
        });
      }
    }
  }
  return new Response('', { status: 404, headers: { Link: LINK_HEADER } });
}

/* ------------------------------------------------------------------ */
/* Migration: copy catalog, names and uploaded images from Hostinger   */
/* ------------------------------------------------------------------ */

async function syncFromSource(env, origin, body) {
  const source = String(env.SEED_SOURCE || '').trim().replace(/\/+$/, '');
  if (!/^https:\/\//.test(source)) return jsonRes({ ok: false, error: 'disabled' }, 403);
  const step = str(body.step || 'catalog');

  if (step === 'catalog') {
    let cat, names;
    try {
      cat = await (await fetch(source + '/api/catalog.php', { headers: { Accept: 'application/json' } })).json();
      names = await (await fetch(source + '/api/products.php', { headers: { Accept: 'application/json' } })).json();
    } catch {
      return jsonRes({ ok: false, error: 'source' }, 502);
    }
    if (!cat || !Array.isArray(cat.items) || !cat.items.length) return jsonRes({ ok: false, error: 'source' }, 502);
    await ensureSchema(env.DB);
    await setKey(env.DB, 'catalog', cat.items);
    await setKey(env.DB, 'names', isArr(names) && !Array.isArray(names) ? names : {});
    return jsonRes({ ok: true, step, items: cat.items.length, names: isArr(names) ? Object.keys(names).length : 0 });
  }

  if (step === 'media') {
    const items = decodeItems(await getKey(env.DB, 'catalog'));
    const have = await uploadedNames(env.DB);
    const wanted = [...new Set(items.map((r) => str(r.image)).filter((i) => i.includes('/api/media.php')).map(imageFilename))];
    const missing = wanted.filter((f) => f && !have.has(f) && !STATIC_UPLOAD_FILES.has(f));
    const batch = missing.slice(0, 12);
    const failed = [];
    for (const f of batch) {
      try {
        const r = await fetch(source + '/api/media.php?f=' + encodeURIComponent(f));
        if (!r.ok) throw new Error(String(r.status));
        const bytes = new Uint8Array(await r.arrayBuffer());
        const ext = f.split('.').pop().toLowerCase();
        await storeMedia(env, f, bytes, EXT_MIME[ext] || r.headers.get('Content-Type') || 'application/octet-stream', nameToMtime(f));
      } catch (e) {
        failed.push(f + ':' + e.message);
      }
    }
    return jsonRes({ ok: true, step, wanted: wanted.length, copied: batch.length - failed.length, remaining: missing.length - batch.length + failed.length, failed });
  }

  return jsonRes({ ok: false, error: 'step' }, 400);
}
