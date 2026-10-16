import express from 'express';
import db from '../db/db.js';

const router = express.Router();

// GET /:alias - Redirect dan tambah clicks
router.get('/:alias', (req, res, next) => {
  try {
    const { alias } = req.params;
    
    // Cari URL asli
    const stmt = db.prepare('SELECT original_url FROM links WHERE alias = ?');
    const link = stmt.get(alias);

    if (!link) {
      return res.status(404).send('Tautan tidak ditemukan');
    }

    // Update klik secara atomik untuk mencegah race condition
    const updateStmt = db.prepare('UPDATE links SET clicks = clicks + 1 WHERE alias = ?');
    updateStmt.run(alias);

    // Redirect pengunjung
    res.redirect(302, link.original_url);
  } catch (error) {
    next(error);
  }
});

export default router;