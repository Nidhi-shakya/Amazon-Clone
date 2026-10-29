import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { closeDB } from '../config/db.js';

describe('ShopZone API Test Suite', () => {
  let serverInstance;
  let port;

  before(async () => {
    await new Promise((resolve) => {
      serverInstance = app.listen(0, () => {
        port = serverInstance.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
    }
    await closeDB();
  });

  const makeRequest = (options, postData = null) => {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: port,
          ...options,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              resolve({ status: res.statusCode, data: parsed });
            } catch (err) {
              resolve({ status: res.statusCode, raw: body });
            }
          });
        }
      );

      req.on('error', reject);

      if (postData) {
        req.write(JSON.stringify(postData));
      }
      req.end();
    });
  };

  it('GET /api/health should return ok status', async () => {
    const res = await makeRequest({ path: '/api/health', method: 'GET' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
  });

  it('GET /api/products should return products and pagination', async () => {
    const res = await makeRequest({ path: '/api/products', method: 'GET' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
  });

  it('GET /api/products/categories should return available categories', async () => {
    const res = await makeRequest({ path: '/api/products/categories', method: 'GET' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
  });

  it('POST /api/auth/register should fail on missing credentials', async () => {
    const res = await makeRequest(
      {
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Test' }
    );
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });
});

