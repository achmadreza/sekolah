import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // ganti dengan password root MySQL
  database: 'sekolah_db',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Koneksi database gagal:', err);
    return;
  }
  console.log('✅ Terhubung ke MySQL');
});

export default connection;
