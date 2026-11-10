# Cloudflare Pages (branch `cloudflare`)

Hostinger deployed this repository root as-is (Apache + PHP). This branch serves the same files on Cloudflare Pages; `functions/[[path]].js` replaces `api/*.php` and `.htaccess`.

## Pages settings
- Production branch: `cloudflare` · Build command: none · Output directory: `/`

## Bindings
- `DB` — D1: tables `store` (catalog, names), `catalog_backups` (last 30), `media` (upload index). Created automatically.
- `MEDIA` — KV namespace with admin-uploaded images (key = file name).
- `ADMIN_PASSWORD` — secret, the admin panel password (was `api/config.php`).
- `SEED_SOURCE` — migration only (`https://tag-eg.online`); delete after cutover.

## Data import (while the domain still points to Hostinger)
1. `POST /api/catalog.php {"action":"sync-from-source","step":"catalog"}`
2. Repeat `POST /api/catalog.php {"action":"sync-from-source","step":"media"}` until `remaining` is 0.
3. Delete `SEED_SOURCE`.

`functions/_static-files.js` lists files in `images/lookbook` and `images/catalog`; regenerate it if those folders change.
