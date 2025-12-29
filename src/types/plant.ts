export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  optimalConditions: string[];
  growthPeriod: string;
  difficulty: 'Easy' | 'Moderate' | 'Difficult';
  nitrogenRange: [number, number]; // min-max in mg/kg
  phosphorusRange: [number, number]; // min-max in mg/kg
  potassiumRange: [number, number]; // min-max in mg/kg
  moistureRange: [number, number]; // min-max percentage
  phRange: [number, number]; // min-max pH
}