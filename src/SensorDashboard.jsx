import { useEffect, useState } from "react";

export default function SensorDashboard() {
  const [data, setData] = useState(null);

  async function fetchData() {
    const res = await fetch("http://localhost:3000/api/latest");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Data Sensor</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Menunggu data...</p>
      )}
    </div>
  );
}
