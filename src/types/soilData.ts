export interface SoilData {
  nitrogen: number;    // mg/kg
  phosphorus: number;  // mg/kg
  potassium: number;   // mg/kg
  moisture: number;    // percentage
  ph: number;          // pH scale (0-14)
  temperature: number; // Celsius
  timestamp: string;   // ISO date string
}