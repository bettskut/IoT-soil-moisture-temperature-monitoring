import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Nilai saat ini (current value) dari progress bar. */
    value: number;
    /** Nilai maksimum (maximum value) dari progress bar (default: 100). */
    max?: number;
}

/**
 * Komponen Progress Bar kustom yang menggunakan Tailwind CSS.
 * Tidak memerlukan utilitas 'cn' eksternal.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    // Pastikan nilai progress tidak negatif
    const safeValue = Math.max(0, value);
    // Menghitung persentase kemajuan
    const progress = (safeValue / max) * 100;
    
    // Batasi progress agar tidak melebihi 100%
    const cappedProgress = Math.min(100, progress);

    return (
      <div
        ref={ref}
        // Menggabungkan class default dengan class yang dikirim melalui prop 'className'
        className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        {...props}
      >
        {/* Indikator Progress */}
        <div
          // bg-current akan mengambil warna yang disetel oleh Tailwind class di parent (misal: [&>div]:bg-green-500)
          className="h-full w-full flex-1 transition-transform duration-500 ease-in-out bg-current"
          // Menggunakan transform: translateX untuk menggerakkan bilah
          style={{ transform: `translateX(-${100 - (cappedProgress || 0)}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }