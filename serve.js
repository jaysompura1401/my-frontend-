/**
 * serve.js  — SPA-aware static server for TotalKaro frontend
 *
 * Replaces:  npx http-server -p 3000
 * Run with:  node serve.js
 *
 * Routing logic:
 *  1. /billing, /billing/*   → billing/index.html       (standalone page)
 *  2. /bulk-stock, /bulk-stock/* → bulk-stock/index.html (standalone page)
 *  3. /accounting, /accounting/* → accounting/index.html (standalone page)
 *  4. Real static assets (.js .css .png etc.) → served directly
 *  5. Everything else → index.html  (Angular SPA handles the route)
 */

'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

/* ──────────────────────────────────────────────
   Helper: send a file, resolving to ROOT-relative
────────────────────────────────────────────── */
function send(res, relPath) {
  const abs = path.join(ROOT, relPath);
  if (fs.existsSync(abs)) {
    res.sendFile(abs);
  } else {
    // fallback to SPA root
    res.sendFile(path.join(ROOT, 'index.html'));
  }
}

/* ──────────────────────────────────────────────
   Standalone sub-app routes (each has own index.html)
   These MUST come before express.static so they
   are never swallowed by the static file handler.
────────────────────────────────────────────── */
const STANDALONE = ['billing', 'bulk-stock', 'accounting'];

STANDALONE.forEach(name => {
  // /billing  or  /billing/  or  /billing/anything
  app.get(`/${name}`, (req, res) => send(res, `${name}/index.html`));
  app.get(`/${name}/`, (req, res) => send(res, `${name}/index.html`));
  app.get(`/${name}/*`, (req, res) => {
    // /billing/some-asset.js etc. — try the real file first
    const rel = req.path.slice(1);           // strip leading /
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      res.sendFile(abs);
    } else {
      send(res, `${name}/index.html`);
    }
  });
});

/* ──────────────────────────────────────────────
   Static assets (JS, CSS, images, fonts, etc.)
   express.static only serves REAL files, never
   intercepts directories.
────────────────────────────────────────────── */
app.use(express.static(ROOT, {
  index: false,    // ← key: don't auto-serve index.html for directories
  redirect: false,
}));

/* ──────────────────────────────────────────────
   SPA catch-all — Angular handles the route
   /dashboard /products /invoices /profile /login
   /donation etc. all land here → serve root index.html
────────────────────────────────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n  ✓  TotalKaro Frontend  →  http://localhost:' + PORT);
  console.log('  ✓  SPA routing enabled — refresh works on all pages\n');
  console.log('  Routes served:');
  console.log('    /                    → Angular SPA (index.html)');
  console.log('    /dashboard           → Angular SPA');
  console.log('    /products            → Angular SPA');
  console.log('    /invoices            → Angular SPA');
  console.log('    /profile             → Angular SPA');
  console.log('    /login               → Angular SPA');
  console.log('    /donation            → Angular SPA (animal-welfare overlay)');
  console.log('    /billing             → billing/index.html');
  console.log('    /bulk-stock          → bulk-stock/index.html');
  console.log('    /accounting          → accounting/index.html\n');
});
