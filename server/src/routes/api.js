import express from 'express';
import db from '../db/db.js';
import { linkSchema } from '../services/validation.js';

const router = express.Router();

// GET /api/health - Cek status backend
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/links - Mengambil daftar tautan
router.get('/links', (req, res, next) => {
  try {
    const stmt = db.prepare('SELECT * FROM links ORDER BY created_at DESC');
    const links = stmt.all();
    res.json(links);
  } catch (error) {
    next(error);
  }
});

// POST /api/links - Membuat tautan baru
router.post('/links', (req, res, next) => {
  try {
    const data = linkSchema.parse(req.body);
    
    const stmt = db.prepare('INSERT INTO links (original_url, alias) VALUES (?, ?)');
    const info = stmt.run(data.original_url, data.alias);
    const link = db.prepare('SELECT * FROM links WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json(link);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Alias sudah digunakan' });
    }
    next(error);
  }
});

// DELETE /api/links/:id - Menghapus tautan
router.delete('/links/:id', (req, res, next) => {
  try {
    const stmt = db.prepare('DELETE FROM links WHERE id = ?');
    const info = stmt.run(req.params.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Tautan tidak ditemukan' });
    }
    res.json({ message: 'Tautan berhasil dihapus' });
  } catch (error) {
    next(error);
  }
});

export default router;