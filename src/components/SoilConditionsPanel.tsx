import React from 'react';
import { Droplets, Thermometer } from 'lucide-react';
import MoistureGauge from './MoistureGauge';
import PhMeter from './PhMeter';

interface SoilConditionsPanelProps {
  moisture: number;
  ph: number;
}

const SoilConditionsPanel: React.FC<SoilConditionsPanelProps> = ({ moisture, ph }) => {
  const getMoistureMessage = (value: number): string => {
    if (value < 20) return "Very dry soil. Immediate watering recommended.";
    if (value < 40) return "Dry soil. Consider watering soon.";
    if (value < 60) return "Moderate moisture. Good conditions for most plants.";
    if (value < 80) return "Moist soil. Ideal for many plants.";
    return "Very wet soil. Consider drainage improvements.";
  };

  const getPhMessage = (value: number): string => {
    if (value < 5.5) return "Acidic soil. Good for acid-loving plants like blueberries and azaleas.";
    if (value < 6.5) return "Slightly acidic soil. Suitable for most vegetables and flowers.";
    if (value < 7.5) return "Neutral soil. Ideal for a wide variety of plants.";
    return "Alkaline soil. Best for plants like lavender and clematis.";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Soil Conditions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Moisture</h3>
          </div>
          <MoistureGauge value={moisture} />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {getMoistureMessage(moisture)}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">pH Level</h3>
          </div>
          <PhMeter value={ph} />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {getPhMessage(ph)}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
          Soil Condition Summary
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Your soil has {moisture}% moisture with a pH of {ph.toFixed(1)}. 
          {moisture > 40 && moisture < 70 && ph > 6 && ph < 7.5 
            ? " These are generally favorable conditions for most common garden plants."
            : " Some plants may thrive in these conditions, while others might need soil amendments."}
        </p>
      </div>
    </div>
  );
};

export default SoilConditionsPanel;