import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET semua jenis pembayaran
router.get('/', (req, res) => {
  db.query('SELECT * FROM jenis_pembayaran', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST tambah jenis pembayaran
router.post('/', (req, res) => {
  const { nama_pembayaran, deskripsi } = req.body;
  db.query(
    'INSERT INTO jenis_pembayaran (nama_pembayaran, deskripsi) VALUES (?, ?)',
    [nama_pembayaran, deskripsi],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Jenis pembayaran ditambahkan', id: results.insertId });
    }
  );
});

export default router;
