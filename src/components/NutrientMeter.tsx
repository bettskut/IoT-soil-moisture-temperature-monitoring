import React, { useEffect, useState } from 'react';

interface NutrientMeterProps {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  description: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
  },
};

const NutrientMeter: React.FC<NutrientMeterProps> = ({ label, value, color, description }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Normalize value for meter (assuming 0-100 scale)
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  const levelText = 
    normalizedValue < 30 ? 'Low' :
    normalizedValue < 70 ? 'Moderate' : 'High';

  useEffect(() => {
    // Animate the value change
    const timer = setTimeout(() => {
      setDisplayValue(normalizedValue);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [normalizedValue]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium text-gray-800 dark:text-white">{label}</span>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${colorMap[color].light} ${colorMap[color].text}`}>
            {levelText}
          </span>
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-white">{value} mg/kg</span>
      </div>
      
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute h-full ${colorMap[color].bg} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${displayValue}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default NutrientMeter;