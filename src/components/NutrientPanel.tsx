import React from 'react';
import NutrientMeter from './NutrientMeter';

interface NutrientPanelProps {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

const NutrientPanel: React.FC<NutrientPanelProps> = ({ nitrogen, phosphorus, potassium }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Soil Nutrients
      </h2>
      
      <div className="space-y-6">
        <NutrientMeter 
          label="Nitrogen (N)" 
          value={nitrogen} 
          color="blue" 
          description="Essential for leaf growth and plant vigor"
        />
        <NutrientMeter 
          label="Phosphorus (P)" 
          value={phosphorus} 
          color="orange"
          description="Vital for root development and flowering"
        />
        <NutrientMeter 
          label="Potassium (K)" 
          value={potassium} 
          color="purple"
          description="Improves overall plant health and disease resistance"
        />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Nutrient Balance
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {getBalanceMessage(nitrogen, phosphorus, potassium)}
        </p>
      </div>
    </div>
  );
};

function getBalanceMessage(n: number, p: number, k: number): string {
  const avg = (n + p + k) / 3;
  const balanced = Math.abs(n - avg) < 10 && Math.abs(p - avg) < 10 && Math.abs(k - avg) < 10;
  
  if (balanced) {
    return "Your soil nutrients are well-balanced, providing good conditions for a variety of plants.";
  }
  
  if (n > p && n > k) {
    return "Nitrogen levels are relatively high. Consider planting leafy vegetables or crops that benefit from nitrogen.";
  }
  
  if (p > n && p > k) {
    return "Phosphorus levels are relatively high. Good for flowering plants and root vegetables.";
  }
  
  if (k > n && k > p) {
    return "Potassium levels are relatively high. Beneficial for overall plant health and fruit development.";
  }
  
  return "Nutrient levels vary. Consider soil amendments to balance nutrients for optimal plant growth.";
}

export default NutrientPanel;