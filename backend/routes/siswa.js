import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET semua siswa
router.get('/', async (req, res) => {
  try {
    const [results] = await db.promise().query(`SELECT * FROM siswa`);
    res.json(results);
  } catch (err) {
    console.error('Error get siswa:', err);
    res.status(500).json({ error: 'Gagal mengambil data siswa' });
  }
});

// GET detail siswa by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.promise().query(`SELECT * FROM siswa WHERE id_siswa = ?`, [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Siswa tidak ditemukan' });
    res.json(results[0]);
  } catch (err) {
    console.error('Error get detail siswa:', err);
    res.status(500).json({ error: 'Gagal mengambil detail siswa' });
  }
});

// POST tambah siswa baru
router.post('/', async (req, res) => {
  try {
    const { nomor_induk, nama_siswa, tanggal_lahir, orang_tua, no_handphone, tahun_ajaran, level } = req.body;

    // Validasi wajib
    if (!nama_siswa || !tanggal_lahir) {
      return res.status(400).json({ error: 'Data wajib diisi (nama_siswa, tanggal_lahir)' });
    }

    const [result] = await db.promise().query(
      `INSERT INTO siswa 
      (nomor_induk, nama_siswa, tanggal_lahir, orang_tua, no_handphone, tahun_ajaran, level) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor_induk || null,
        nama_siswa,
        tanggal_lahir,
        orang_tua || null,
        no_handphone || null,
        tahun_ajaran || null,
        level || null
      ]
    );

    res.status(201).json({ message: 'Siswa berhasil ditambahkan', id_siswa: result.insertId });
  } catch (err) {
    console.error('Error insert siswa:', err);
    res.status(500).json({ error: 'Gagal menambahkan siswa', detail: err.sqlMessage });
  }
});

// PUT update siswa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nomor_induk, nama_siswa, tanggal_lahir, orang_tua, no_handphone, tahun_ajaran, level } = req.body;

  // Validasi wajib
  if (!nama_siswa || !tanggal_lahir) {
    return res.status(400).json({ error: 'Data wajib diisi (nama_siswa, tanggal_lahir)' });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE siswa 
       SET nomor_induk = ?, nama_siswa = ?, tanggal_lahir = ?, orang_tua = ?, no_handphone = ?, tahun_ajaran = ?, level = ?
       WHERE id_siswa = ?`,
      [
        nomor_induk || null,
        nama_siswa,
        tanggal_lahir,
        orang_tua || null,
        no_handphone || null,
        tahun_ajaran || null,
        level || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' });
    }

    res.json({ message: 'Siswa berhasil diupdate' });
  } catch (err) {
    console.error('Error update siswa:', err);
    res.status(500).json({ error: 'Gagal mengupdate siswa', detail: err.sqlMessage });
  }
});

// DELETE siswa + semua pembayaran terkait
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Mulai transaksi
    await db.promise().query('START TRANSACTION');

    // Hapus pembayaran terkait siswa
    await db.promise().query('DELETE FROM pembayaran WHERE id_siswa = ?', [id]);

    // Hapus siswa
    const [result] = await db.promise().query('DELETE FROM siswa WHERE id_siswa = ?', [id]);

    if (result.affectedRows === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(404).json({ error: `Siswa dengan id ${id} tidak ditemukan` });
    }

    // Commit transaksi
    await db.promise().query('COMMIT');

    res.json({ message: 'Siswa dan pembayaran terkait berhasil dihapus' });
  } catch (err) {
    console.error('Error hapus siswa:', err);
    await db.promise().query('ROLLBACK');
    res.status(500).json({ error: 'Gagal menghapus siswa', detail: err.sqlMessage });
  }
});



export default router;
