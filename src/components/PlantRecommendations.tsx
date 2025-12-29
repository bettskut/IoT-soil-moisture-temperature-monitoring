import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { SoilData } from '../types/soilData';
import { getPlantRecommendations } from '../services/recommendationService';
import PlantCard from './PlantCard';

interface PlantRecommendationsProps {
  soilData: SoilData | null;
}

const PlantRecommendations: React.FC<PlantRecommendationsProps> = ({ soilData }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!soilData) return null;
  
  const recommendations = getPlantRecommendations(soilData);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div 
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Leaf className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Recommended Plants
          </h2>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Based on your soil's nutrient profile (N: {soilData.nitrogen} mg/kg, 
            P: {soilData.phosphorus} mg/kg, K: {soilData.potassium} mg/kg), 
            moisture ({soilData.moisture}%), and pH ({soilData.ph.toFixed(1)}), 
            the following plants are recommended for optimal growth:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
          
          {recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No plant recommendations available for the current soil conditions.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantRecommendations;