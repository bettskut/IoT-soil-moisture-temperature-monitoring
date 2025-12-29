import React, { useEffect, useState } from 'react';

interface PhMeterProps {
  value: number;
}

const PhMeter: React.FC<PhMeterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(7);
  
  // Clamp value between 0 and 14 (pH scale)
  const clampedValue = Math.min(Math.max(value, 0), 14);
  
  // Calculate percentage for the meter (0-14 scale to 0-100%)
  const percentage = (clampedValue / 14) * 100;
  
  useEffect(() => {
    // Animate the value change
    const timer = setTimeout(() => {
      setDisplayValue(clampedValue);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [clampedValue]);

  // Get color and label based on pH value
  const getPhProperties = () => {
    if (clampedValue < 5.5) return { color: 'bg-red-500', label: 'Acidic' };
    if (clampedValue < 6.5) return { color: 'bg-orange-400', label: 'Slightly Acidic' };
    if (clampedValue < 7.5) return { color: 'bg-green-500', label: 'Neutral' };
    if (clampedValue < 8.5) return { color: 'bg-blue-400', label: 'Slightly Alkaline' };
    return { color: 'bg-indigo-500', label: 'Alkaline' };
  };
  
  const { color, label } = getPhProperties();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`px-2 py-0.5 text-xs rounded-full bg-opacity-20 ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
          {label}
        </span>
        <span className="text-lg font-semibold text-gray-800 dark:text-white">pH {displayValue.toFixed(1)}</span>
      </div>
      
      {/* pH scale visualization */}
      <div className="relative h-6 bg-gradient-to-r from-red-500 via-green-500 to-indigo-500 rounded-md overflow-hidden">
        {/* pH value marker */}
        <div 
          className="absolute top-0 w-2 h-full bg-white border-2 border-gray-800 dark:border-white transition-all duration-1000 ease-out"
          style={{ left: `calc(${percentage}% - 4px)` }}
        ></div>
        
        {/* pH scale markers */}
        {[0, 2, 4, 6, 8, 10, 12, 14].map((mark) => (
          <div 
            key={mark}
            className="absolute top-0 w-0.5 h-2 bg-black bg-opacity-30 dark:bg-white dark:bg-opacity-30"
            style={{ left: `${(mark / 14) * 100}%` }}
          ></div>
        ))}
      </div>
      
      {/* pH scale labels */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>0</span>
        <span>Acidic</span>
        <span>7</span>
        <span>Alkaline</span>
        <span>14</span>
      </div>
    </div>
  );
};

export default PhMeter;