const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 5173);
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(REPORTS_FILE);
  } catch {
    await fs.writeFile(REPORTS_FILE, '[]\n');
  }
}

async function readReports() {
  await ensureStore();
  const raw = await fs.readFile(REPORTS_FILE, 'utf8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeReports(reports) {
  await ensureStore();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2) + '\n');
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), { 'Content-Type': MIME['.json'] });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 200_000) {
        reject(new Error('body-too-large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function parseJson(req) {
  const raw = await readBody(req);
  if (!raw) return {};
  return JSON.parse(raw);
}

function cleanText(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/reports' && req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const reports = await readReports();
    reports.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    sendJson(res, 200, reports);
    return;
  }

  if (url.pathname === '/api/reports' && req.method === 'POST') {
    let payload;
    try {
      payload = await parseJson(req);
    } catch {
      sendJson(res, 400, { error: 'invalid-json' });
      return;
    }
    const body = cleanText(payload.body, 5000);
    if (body.length < 4) {
      sendJson(res, 400, { error: 'body-required' });
      return;
    }
    const reports = await readReports();
    const report = {
      id: crypto.randomUUID(),
      type: cleanText(payload.type, 80) || '其他建議',
      station: cleanText(payload.station, 120),
      body,
      contact: cleanText(payload.contact, 160),
      page: cleanText(payload.page, 500),
      userAgent: cleanText(payload.userAgent, 800),
      status: 'new',
      note: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reports.unshift(report);
    await writeReports(reports);
    sendJson(res, 201, report);
    return;
  }

  const match = url.pathname.match(/^\/api\/reports\/([^/]+)$/);
  if (match && req.method === 'PATCH') {
    if (!requireAdmin(req, res)) return;
    let payload;
    try {
      payload = await parseJson(req);
    } catch {
      sendJson(res, 400, { error: 'invalid-json' });
      return;
    }
    const reports = await readReports();
    const report = reports.find(item => item.id === match[1]);
    if (!report) {
      sendJson(res, 404, { error: 'not-found' });
      return;
    }
    if (payload.status && ['new', 'doing', 'done'].includes(payload.status)) report.status = payload.status;
    if (payload.note != null) report.note = cleanText(payload.note, 2000);
    report.updatedAt = new Date().toISOString();
    await writeReports(reports);
    sendJson(res, 200, report);
    return;
  }

  if (match && req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    const reports = await readReports();
    const next = reports.filter(item => item.id !== match[1]);
    if (next.length === reports.length) {
      sendJson(res, 404, { error: 'not-found' });
      return;
    }
    await writeReports(next);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: 'not-found' });
}

function requireAdmin(req, res) {
  if (req.headers['x-admin-pin'] === ADMIN_PIN) return true;
  sendJson(res, 401, { error: 'admin-pin-required' });
  return false;
}

async function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT) || filePath.includes(`${path.sep}data${path.sep}`)) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    send(res, 200, data, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  } catch {
    send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) await handleApi(req, res, url);
    else await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: 'server-error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
