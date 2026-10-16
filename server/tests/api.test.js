import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db/db.js';

beforeAll(() => {
  // Bersihkan database sebelum testing
  db.exec('DELETE FROM links');
});

describe('LinkForge Backend API', () => {
  it('GET /api/health mengembalikan status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/links membuat short URL valid', async () => {
    const res = await request(app).post('/api/links').send({
      original_url: 'https://github.com',
      alias: 'my-github'
    });
    expect(res.status).toBe(201);
    expect(res.body.alias).toBe('my-github');
    expect(res.body.clicks).toBe(0);
  });

  it('POST /api/links menolak protokol berbahaya (javascript:)', async () => {
    const res = await request(app).post('/api/links').send({
      original_url: 'javascript:alert(1)',
      alias: 'hacker'
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/links menolak alias duplikat', async () => {
    const res = await request(app).post('/api/links').send({
      original_url: 'https://google.com',
      alias: 'my-github' // Sama dengan test ke-2
    });
    expect(res.status).toBe(409);
  });

  it('GET /:alias melakukan redirect dan menambah klik tepat 1 kali', async () => {
    const res = await request(app).get('/my-github');
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('https://github.com');

    // Cek jumlah klik di database
    const link = db.prepare('SELECT clicks FROM links WHERE alias = ?').get('my-github');
    expect(link.clicks).toBe(1);
  });
});