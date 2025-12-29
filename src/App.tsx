import React, { useEffect, useState, useMemo, forwardRef } from "react";
import { Sun, Instagram } from "lucide-react";

// URL API yang akan diambil datanya (Pastikan ini sesuai dengan server.js)
const API_URL = "http://localhost:3000/api/latest";

// =================================================================
// 1. SHADCN/UI MOCK COMPONENTS (Card dan Progress)
// =================================================================

// Card Component Mock
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Progress Component
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
}
const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    const safeValue = Math.max(0, value);
    const progress = (safeValue / max) * 100;
    const cappedProgress = Math.min(100, progress);

    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-transform duration-500 ease-in-out bg-current"
          style={{ transform: `translateX(-${100 - (cappedProgress || 0)}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

// =================================================================
// 2. DATA TYPING AND UTILITIES
// =================================================================

interface SensorData {
    moist: number;
    ph: number;
    suhu: number;
    n: number;
    p: number;
    k: number;
}

// Data awal untuk menghindari error saat menunggu fetch pertama
const initialData: SensorData = {
    moist: 0.0,
    ph: 0.0,
    suhu: 0.0,
    n: 0,
    p: 0,
    k: 0,
};

const getNutrientLevel = (value: number, type: 'N' | 'P' | 'K'): 'High' | 'Moderate' | 'Low' => {
  if (type === 'N') {
    if (value >= 120) return 'High';
    if (value >= 40) return 'Moderate';
    return 'Low';
  } else if (type === 'P') {
    if (value >= 50) return 'High';
    if (value >= 20) return 'Moderate';
    return 'Low';
  } else if (type === 'K') {
    if (value >= 180) return 'High';
    if (value >= 60) return 'Moderate';
    return 'Low';
  }
  return 'Low';
};

const getNutrientDetails = (type: 'N' | 'P' | 'K') => {
    switch (type) {
        case 'N':
            return { label: 'Nitrogen (N)', description: 'Essential for leaf growth and plant vigor', color: 'bg-blue-500' };
        case 'P':
            return { label: 'Phosphorus (P)', description: 'Vital for root development and flowering', color: 'bg-orange-500' };
        case 'K':
            return { label: 'Potassium (K)', description: 'Improves overall plant health and disease resistance', color: 'bg-purple-500' };
        default:
            return { label: '', description: '', color: '' };
    }
}

const getSoilConditionSummary = (moisture: number, suhu: number): string => {
    let summary = `Your soil has ${moisture.toFixed(2)}% moisture with a Temperature of ${suhu.toFixed(1)}°C.`;
// Kelembaban (Moisture)
if (moisture >= 60 && moisture <= 80) {
    summary += " These are generally favorable moisture conditions for most common garden plants.";
} else if (moisture > 80) {
    summary += " Moisture is high, which may lead to waterlogging for some plants.";
} else {
    summary += " Moisture is low, and plants may require watering soon.";
}

// Temperature
if (suhu >= 20 && suhu <= 35) {
    summary += " The temperature is Optimal for plant growth.";
} else if (suhu < 20) {
    summary += " The temperature is Low, which may slow down plant growth.";
} else {
    summary += " The temperature is High, which may cause heat stress to plants.";
}

return summary;

};


// =================================================================
// 3. COMPONENTS
// =================================================================

interface NutrientBarProps {
    type: 'N' | 'P' | 'K';
    value: number;
}

const NutrientBar: React.FC<NutrientBarProps> = ({ type, value }) => {
    const level = getNutrientLevel(value, type);
    const { label, description } = getNutrientDetails(type);
    
    // Nilai maksimum untuk Progress Bar (disesuaikan agar level High berada di 100%)
    const maxValue = type === 'N' ? 150 : type === 'P' ? 70 : 250; 
    const progressValue = (value / maxValue) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        level === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        level === 'Moderate' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>{level}</span>
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{value} mg/kg</span>
            </div>
            {/* Progress Bar */}
            <Progress 
                value={progressValue} 
                className={`h-2 ${
                    level === 'High' ? '[&>div]:bg-green-500' :
                    level === 'Moderate' ? '[&>div]:bg-orange-500' :
                    '[&>div]:bg-red-500'
                }`} 
                max={100}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
    );
}

// =================================================================
// 4. MAIN APP COMPONENT (FIXED FETCH LOGIC)
// =================================================================

export default function App() {
    // Menggunakan initialData untuk inisialisasi state
    const [data, setData] = useState<SensorData>(initialData); 
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const fetchData = async () => {
        try {
            setError(null);
            setIsLoading(true);
            // Implementasi backoff eksponensial untuk mengatasi throttling API
            const maxRetries = 3;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(API_URL);

                    if (!response.ok) {
                        throw new Error(`Gagal mengambil data: Status ${response.status}.`);
                    }

                    const raw = await response.json();

/* NORMALISASI DATA DARI BACKEND (ANTI WHITE SCREEN) */
const normalizedData: SensorData = {
  moist: raw.moist ?? raw.moisture ?? 0,
  suhu: raw.suhu ?? raw.temperature ?? 0,
  ph: raw.ph ?? 6.8,
  n: raw.n ?? 0,
  p: raw.p ?? 0,
  k: raw.k ?? 0,
};

setData(normalizedData);
 
                    break; // Berhasil, keluar dari loop
                } catch (e) {
                    if (i === maxRetries - 1) throw e; // Gagal setelah semua percobaan
                    const delay = Math.pow(2, i) * 1000;
                    // Tunggu dengan delay eksponensial
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        } catch (err: any) {
             console.error("Fetch Error:", err);
             // Tampilkan error jika koneksi gagal (Server mati atau CORS masih bermasalah)
             setError(`[KONEKSI GAGAL] Pastikan server Node.js berjalan di ${API_URL} dan tidak ada masalah CORS.`);
        } finally {
            setIsLoading(false);
        }
    };

    // Mengambil data saat pertama kali dimuat dan setiap 5 detik
    useEffect(() => {
        fetchData(); 
        const interval = setInterval(fetchData, 5000); 

        return () => clearInterval(interval);
    }, []);

    // Gunakan useMemo untuk menghitung ringkasan hanya saat data berubah
    const nutrientSummary = useMemo(() => {
        if (!data || isLoading) return 'Memuat ringkasan nutrisi...';
        const nLevel = getNutrientLevel(data.n, 'N');
        const pLevel = getNutrientLevel(data.p, 'P');
        const kLevel = getNutrientLevel(data.k, 'K');
        
        let summary = '';

        if (kLevel === 'High') {
            summary = "Potassium levels are relatively **Beneficial** for overall plant health and fruit development.";
        } else if (nLevel === 'High') {
            summary = "Nitrogen levels are **High**, promoting excellent leaf growth and vigor.";
        } else if (pLevel === 'Moderate') {
            summary = "Phosphorus is at a **Moderate** level, supporting good root and flower development.";
        } else {
            summary = "Nutrient balance is generally adequate, but check individual levels for specific plant needs.";
        }
        return summary;
    }, [data, isLoading]);

    const soilSummary = useMemo(() => data ? getSoilConditionSummary(data.moist, data.suhu) : 'Memuat ringkasan kondisi tanah...', [data]);

    if (isLoading && data.moist === 0.0) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                <p className="ml-4 text-xl text-gray-600 dark:text-gray-300">Menunggu data pertama dari server...</p>
             </div>
         );
    }
    
    if (error) {
        return (
            <div className="p-8 min-h-screen bg-red-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-red-500 max-w-lg">
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Kesalahan Koneksi Data!</h2>
                    <p className="text-gray-700">Tidak dapat mengambil data dari server backend.</p>
                    <p className="mt-3 font-mono text-sm break-all">{error}</p>
                    <p className="mt-4 text-sm font-semibold text-red-600">
                        Pastikan: 1. Server Express berjalan di `localhost:3000`. 2. ESP8266 mengirim data ke `/api/sensor`.
                    </p>
                </div>
            </div>
        );
    }

    // Menentukan status pH untuk ditampilkan di UI
    const phStatus = data.ph >= 6.0 && data.ph <= 7.5 ? 'Neutral' : data.ph < 6.0 ? 'Acidic' : 'Alkaline';
    const phColor = data.ph >= 6.0 && data.ph <= 7.5 ? 'text-green-500' : data.ph < 6.0 ? 'text-yellow-500' : 'text-red-500';


    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-6 sm:p-10 font-inter">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <span className="text-3xl font-extrabold text-green-700 dark:text-green-400">🌱 SoilSense</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-lg text-gray-600 dark:text-gray-300 flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Sun className="h-6 w-6 mr-2 text-yellow-500" /> 
                        <span className="font-bold">{data.suhu.toFixed(1)}°C</span>
                    </div>
                    {/* Tombol Update kini memanggil fetchData yang sesungguhnya */}
                    <button 
                        onClick={fetchData} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m7.531-1.357L11 3m0 3v2m0 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {isLoading ? 'Updating...' : 'Update Now'}
                    </button>
                </div>
            </header>

            <h1 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-gray-100">
                Real-Time Soil Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Panel Kiri: Soil Nutrients */}
                {/* Panel Kiri: About Website */}
                <Card className="shadow-2xl lg:col-span-3">
                <CardHeader>
                    <CardTitle>About SoilSense</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    Smart soil monitoring web dashboard
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">

                    <p>
                    <strong>SoilSense</strong> is a web-based dashboard designed to monitor
                    real-time soil conditions using IoT technology. The system helps users
                    understand soil health easily through visual and textual insights.
                    </p>

                    <div>
                    <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                        👨‍💻 About the Developers
                    </h3>

                    <p className="mb-4">
                        This website was designed and developed as a smart agriculture and IoT-based
                        project to visualize real-time soil data in an intuitive and informative way.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Developer 1 */}
                        <div className="p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <h4 className="text-lg font-semibold">Elberth Natan Pratama Limbong</h4>
                        <a
                            href="https://instagram.com/elberthlimbong"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
                        >
                            <Instagram className="w-4 h-4" />
                            Instagram
                        </a>
                        </div>

                        {/* Developer 2 */}
                        <div className="p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <h4 className="text-lg font-semibold">Rafiqi Azri</h4>
                        <a
                            href="https://instagram.com/rafiqi_azr1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
                        >
                            <Instagram className="w-4 h-4" />
                            Instagram
                        </a>
                        </div>

                        {/* Developer 3 */}
                        <div className="p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <h4 className="text-lg font-semibold">M. Ataulloh Al Gafiqi</h4>
                        <a
                            href="https://instagram.com/ataullohout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
                        >
                            <Instagram className="w-4 h-4" />
                            Instagram
                        </a>
                        </div>

                    </div>
                    </div>

                    <div className="p-4 rounded-xl bg-green-50 dark:bg-gray-700 border border-green-200 dark:border-gray-600">
                    <h3 className="text-lg font-bold mb-1 text-green-700 dark:text-green-400">
                        🎯 System Purpose
                    </h3>
                    <p>
                        SoilSense aims to support smart agriculture by providing accurate,
                        real-time soil data that helps improve crop productivity and soil care
                        decisions.
                    </p>
                    </div>

                </CardContent>
                </Card>


                {/* Panel Kanan: Soil Conditions */}
                <Card className="shadow-2xl lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Physical Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        
                        {/* Kelembaban (Moisture) */}
                        <div className="mb-8 p-4 border rounded-xl dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">💧 Soil Moisture</span>
                                <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">{data.moist.toFixed(2)}%</span>
                            </div>
                            <Progress 
                                value={data.moist} 
                                className="h-6 [&>div]:bg-cyan-500/80" 
                                max={100}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {data.moist >= 60 && data.moist <= 80 ? 'Optimal moisture level.' : 
                                data.moist > 80 ? 'High moisture, risk of root rot.' :
                                'Low moisture, requires watering.'}
                            </p>
                        </div>

                        {/* Temperature */}
<div className="mb-8 p-4 border rounded-xl dark:border-gray-700">
  <div className="flex justify-between items-center mb-2">
    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">🌡️ Temperature</span>
    <span className="text-2xl font-extrabold text-orange-500">
      {data.suhu.toFixed(1)} °C
    </span>
  </div>

  <Progress
    value={data.suhu}
    max={50}
    className="h-4 [&>div]:bg-orange-500"
  />

  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
    <span>0°C</span>
    <span>25°C</span>
    <span>50°C</span>
  </div>

  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
    {data.suhu < 20
      ? "Temperature is low."
      : data.suhu <= 35
      ? "Temperature is optimal."
      : "Temperature is high."}
  </p>
</div>

                        {/* Ringkasan Kondisi Tanah */}
                        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600">
                            <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-400">Condition Report</h3>
                            <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: soilSummary }} />
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}