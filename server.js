import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

// CORS (frontend React di Vite)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

/* =========================
   DATA SENSOR TERAKHIR
========================= */
let latestSensorData = {
  moisture: 0,       // %
  temperature: 0,    // °C
  n: 0,
  p: 0,
  k: 0,
  updatedAt: null
};

/* =========================
   POST dari ESP / save.php
========================= */
app.post('/api/sensor', (req, res) => {
  const data = req.body;

  // Validasi minimal & aman
  if (
    typeof data.moist === 'number' &&
    typeof data.suhu === 'number'
  ) {
    latestSensorData = {
      moisture: data.moist,
      temperature: data.suhu,
      n: data.n ?? 0,
      p: data.p ?? 0,
      k: data.k ?? 0,
      updatedAt: new Date().toISOString()
    };

    console.log('✓ Data sensor diterima:', latestSensorData);
    res.status(200).json({ message: 'Data sensor diterima' });
  } else {
    console.error('✗ Data tidak valid:', data);
    res.status(400).json({ message: 'Format data tidak valid' });
  }
});

/* =========================
   GET untuk React Frontend
========================= */
app.get('/api/latest', (req, res) => {
  res.json(latestSensorData);
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🌐 CORS diizinkan untuk http://localhost:5173`);
});