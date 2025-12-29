import React from 'react';
import { Plant } from '../types/plant';
import { CheckCircle2 } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={plant.imageUrl} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{plant.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{plant.scientificName}</p>
        
        <div className="mt-3 space-y-1">
          {plant.optimalConditions.map((condition, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{condition}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Growth period: {plant.growthPeriod}</span>
          <span>Difficulty: {plant.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;