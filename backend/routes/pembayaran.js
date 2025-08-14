import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET semua pembayaran
router.get('/', async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
  p.id_pembayaran,
  s.id_siswa,
  s.nomor_induk,
  s.nama_siswa,
  s.tanggal_lahir,
  s.orang_tua,
  s.no_handphone,
  s.level,
  s.tahun_ajaran,
  p.jenis_pembayaran,
  p.bulan,
  p.tanggal_bayar,
  p.jumlah,
  p.status
FROM pembayaran p
JOIN siswa s ON p.id_siswa = s.id_siswa
ORDER BY p.tanggal_bayar DESC;
    `);
    res.json(results);
  } catch (err) {
    console.error('Error get pembayaran:', err);
    res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
  }
});



// UPDATE pembayaran
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    tanggalLahir,
    orangTua,
    noHandphone,
    level,
    tahun,
    jenisPembayaran,
    bulan,
    tanggalBayar,
    jumlah,
    status
  } = req.body;

  try {
    // Ambil id_siswa dari pembayaran
    const [rows] = await db.promise().query(
      "SELECT id_siswa FROM pembayaran WHERE id_pembayaran = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Pembayaran dengan id ${id} tidak ditemukan` });
    }

    const id_siswa = rows[0].id_siswa;

    const tglLahir = tanggalLahir || null;
    const tglBayar = tanggalBayar || null;
    const jumlahVal = jumlah !== undefined && !isNaN(Number(jumlah)) ? Number(jumlah) : 0;

    // Mulai transaksi
    await db.promise().query("START TRANSACTION");

    // Update tabel siswa
    await db.promise().query(
      `UPDATE siswa 
       SET nama_siswa = ?, 
           tanggal_lahir = ?, 
           orang_tua = ?, 
           no_handphone = ?, 
           level = ?, 
           tahun_ajaran = ?
       WHERE id_siswa = ?`,
      [nama, tglLahir, orangTua, noHandphone, level, tahun, id_siswa]
    );

    // Update tabel pembayaran
    await db.promise().query(
      `UPDATE pembayaran 
       SET jenis_pembayaran = ?, 
           bulan = ?, 
           tanggal_bayar = ?, 
           jumlah = ?, 
           status = ?
       WHERE id_pembayaran = ?`,
      [jenisPembayaran, bulan, tglBayar, jumlahVal, status, id]
    );

    // Commit transaksi
    await db.promise().query("COMMIT");

    res.json({ message: "Pembayaran dan data siswa berhasil diupdate" });

  } catch (err) {
    console.error("Error update pembayaran + siswa:", err);

    try {
      await db.promise().query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback gagal:", rollbackErr);
    }

    res.status(500).json({
      error: "Gagal mengupdate pembayaran dan data siswa",
      detail: err.sqlMessage || err.message
    });
  }
});



// POST tambah siswa + pembayaran
router.post('/', async (req, res) => {
  const {
    nama,
    tanggalLahir,
    orangTua,
    noHandphone,
    level,
    tahun,
    jenisPembayaran,
    bulan,
    tanggalBayar,
    jumlah,
    status
  } = req.body;

  // Validasi wajib
  // if (!nama || !jumlah || !tanggalBayar) {
  //   return res.status(400).json({
  //     error: 'Data wajib diisi (nama, jumlah, tanggal_bayar)'
  //   });
  // }

  try {
    // Mulai transaksi
    await db.promise().query('START TRANSACTION');

    // Tambah siswa baru
    const [siswaResult] = await db.promise().query(
      `INSERT INTO siswa 
        (nama_siswa, tanggal_lahir, orang_tua, no_handphone, level, tahun_ajaran)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, tanggalLahir || null, orangTua || null, noHandphone || null, level || null, tahun || null]
    );

    const id_siswa = siswaResult.insertId;

    // Tambah pembayaran untuk siswa baru
    const [pembayaranResult] = await db.promise().query(
      `INSERT INTO pembayaran 
        (id_siswa, jenis_pembayaran, bulan, tanggal_bayar, jumlah, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_siswa,
        jenisPembayaran || null,
        bulan || null,
        tanggalBayar,
        Number(jumlah),
        status || 'Belum Lunas'
      ]
    );

    // Commit transaksi
    await db.promise().query('COMMIT');

    res.status(201).json({
      message: 'Siswa dan pembayaran berhasil ditambahkan',
      id_siswa,
      id_pembayaran: pembayaranResult.insertId
    });

  } catch (err) {
    console.error('Error tambah siswa + pembayaran:', err);

    try {
      await db.promise().query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Rollback gagal:', rollbackErr);
    }

    res.status(500).json({
      error: 'Gagal menambahkan siswa dan pembayaran',
      detail: err.sqlMessage || err.message
    });
  }
});





export default router;
