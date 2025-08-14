import express from 'express';
import cors from 'cors';
import siswaRoutes from './routes/siswa.js';
import pembayaranRoutes from './routes/pembayaran.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/siswa', siswaRoutes);
app.use('/pembayaran', pembayaranRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
