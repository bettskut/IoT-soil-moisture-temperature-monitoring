import React, { useEffect, useState } from 'react';

interface MoistureGaugeProps {
  value: number;
}

const MoistureGauge: React.FC<MoistureGaugeProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Normalize value (0-100)
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate rotation angle (from -90 to 90 degrees)
  const rotationAngle = -90 + (normalizedValue / 100) * 180;
  
  useEffect(() => {
    // Animate the value change
    const timer = setTimeout(() => {
      setDisplayValue(normalizedValue);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [normalizedValue]);

  // Get color based on value
  const getColor = () => {
    if (normalizedValue < 20) return 'text-red-500';
    if (normalizedValue < 40) return 'text-orange-500';
    if (normalizedValue < 70) return 'text-green-500';
    if (normalizedValue < 85) return 'text-blue-400';
    return 'text-blue-600';
  };

  return (
    <div className="relative w-full h-32 flex flex-col items-center justify-end">
      {/* Gauge display */}
      <div className="absolute bottom-0 w-full h-16 bg-gray-100 dark:bg-gray-700 rounded-t-full overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-600 opacity-20"
        ></div>
      </div>
      
      {/* Gauge markers */}
      <div className="absolute bottom-0 w-full h-16">
        <div className="relative w-full h-full">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div 
              key={mark}
              className="absolute bottom-0 w-0.5 h-3 bg-gray-400 dark:bg-gray-500"
              style={{ left: `${mark}%` }}
            ></div>
          ))}
          {[0, 25, 50, 75, 100].map((mark) => (
            <div 
              key={`label-${mark}`}
              className="absolute bottom-4 text-[10px] text-gray-500 dark:text-gray-400"
              style={{ left: `${mark}%`, transform: 'translateX(-50%)' }}
            >
              {mark}%
            </div>
          ))}
        </div>
      </div>
      
      {/* Gauge needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-1 h-16 bg-gray-800 dark:bg-white origin-bottom transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-50%) rotate(${rotationAngle}deg)` }}
      >
        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-gray-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
      </div>
      
      {/* Current value display */}
      <div className={`absolute -top-1 text-2xl font-bold ${getColor()}`}>
        {displayValue.toFixed(0)}%
      </div>
    </div>
  );
};

export default MoistureGauge;