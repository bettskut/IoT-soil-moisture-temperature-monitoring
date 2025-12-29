import { SoilData } from '../types/soilData';
import { Plant } from '../types/plant';

// Database of plants with their optimal growing conditions
const plantDatabase: Plant[] = [
  {
    id: '1',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Well-draining soil',
      'Full sun exposure',
      'Regular watering',
      'Slightly acidic soil'
    ],
    growthPeriod: '70-85 days',
    difficulty: 'Moderate',
    nitrogenRange: [40, 80],
    phosphorusRange: [45, 85],
    potassiumRange: [40, 80],
    moistureRange: [40, 70],
    phRange: [6.0, 6.8]
  },
  {
    id: '2',
    name: 'Carrot',
    scientificName: 'Daucus carota',
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Loose, sandy soil',
      'Cool weather crop',
      'Consistent moisture',
      'Neutral pH'
    ],
    growthPeriod: '60-80 days',
    difficulty: 'Easy',
    nitrogenRange: [20, 50],
    phosphorusRange: [40, 70],
    potassiumRange: [50, 90],
    moistureRange: [50, 70],
    phRange: [6.0, 7.0]
  },
  {
    id: '3',
    name: 'Lettuce',
    scientificName: 'Lactuca sativa',
    imageUrl: 'https://images.pexels.com/photos/539431/pexels-photo-539431.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Rich, moisture-retentive soil',
      'Cool conditions',
      'Regular watering',
      'Partial shade in hot weather'
    ],
    growthPeriod: '45-60 days',
    difficulty: 'Easy',
    nitrogenRange: [30, 70],
    phosphorusRange: [20, 50],
    potassiumRange: [30, 60],
    moistureRange: [50, 70],
    phRange: [6.0, 7.0]
  },
  {
    id: '4',
    name: 'Onion',
    scientificName: 'Allium cepa',
    imageUrl: 'https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Well-draining, fertile soil',
      'Full sun',
      'Consistent moisture',
      'Neutral pH'
    ],
    growthPeriod: '90-110 days',
    difficulty: 'Easy',
    nitrogenRange: [30, 60],
    phosphorusRange: [40, 80],
    potassiumRange: [50, 90],
    moistureRange: [40, 60],
    phRange: [6.0, 7.5]
  },
  {
    id: '5',
    name: 'Bell Pepper',
    scientificName: 'Capsicum annuum',
    imageUrl: 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Rich, well-draining soil',
      'Full sun',
      'Regular watering',
      'Slightly acidic soil'
    ],
    growthPeriod: '60-90 days',
    difficulty: 'Moderate',
    nitrogenRange: [40, 80],
    phosphorusRange: [45, 85],
    potassiumRange: [45, 85],
    moistureRange: [50, 70],
    phRange: [5.8, 6.5]
  },
  {
    id: '6',
    name: 'Cucumber',
    scientificName: 'Cucumis sativus',
    imageUrl: 'https://images.pexels.com/photos/37528/cucumber-salad-food-healthy-37528.jpeg?auto=compress&cs=tinysrgb&w=800',
    optimalConditions: [
      'Warm temperatures',
      'Well-draining soil',
      'Consistent moisture',
      'Neutral to slightly acidic soil'
    ],
    growthPeriod: '50-70 days',
    difficulty: 'Easy',
    nitrogenRange: [30, 70],
    phosphorusRange: [40, 80],
    potassiumRange: [50, 90],
    moistureRange: [50, 80],
    phRange: [6.0, 7.0]
  }
];

// Function to recommend plants based on soil data
export function getPlantRecommendations(soilData: SoilData): Plant[] {
  // Filter plants that match the soil conditions
  return plantDatabase.filter(plant => {
    const nitrogenMatch = isInRange(soilData.nitrogen, plant.nitrogenRange);
    const phosphorusMatch = isInRange(soilData.phosphorus, plant.phosphorusRange);
    const potassiumMatch = isInRange(soilData.potassium, plant.potassiumRange);
    const moistureMatch = isInRange(soilData.moisture, plant.moistureRange);
    const phMatch = isInRange(soilData.ph, plant.phRange);
    
    // A plant is recommended if it matches most conditions
    // This is a simplified approach; in a real system, you might use a scoring system
    const matchScore = [nitrogenMatch, phosphorusMatch, potassiumMatch, moistureMatch, phMatch]
      .filter(Boolean).length;
    
    return matchScore >= 3; // At least 3 conditions should match
  });
}

// Helper function to check if a value is within a range
function isInRange(value: number, range: [number, number]): boolean {
  return value >= range[0] && value <= range[1];
}