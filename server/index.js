import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let soilMoisture = 0;

app.post("/update", (req, res) => {
  const { moisture } = req.body;
  soilMoisture = moisture;
  console.log(`Data diterima: ${moisture}%`);
  res.json({ status: "ok", received: moisture });
});

app.get("/data", (req, res) => {
  res.json({ moisture: soilMoisture });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});
