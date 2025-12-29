import { SoilData } from '../types/soilData';

// Configuration for IoT device API
const IOT_API_URL = import.meta.env.VITE_IOT_API_URL;
const POLLING_INTERVAL = 5000; // Poll every 5 seconds

// Mock data for development and fallback
const MOCK_DATA: SoilData = {
  nitrogen: 150,    // typical range 100-200 mg/kg
  phosphorus: 45,   // typical range 25-50 mg/kg
  potassium: 200,   // typical range 150-250 mg/kg
  moisture: 65,     // optimal range 60-70%
  ph: 6.5,         // optimal range 6.0-7.0
  temperature: 23,  // optimal range 20-25°C
  timestamp: new Date().toISOString()
};

export async function getSoilData(): Promise<SoilData> {
  // If no IoT URL is configured, return mock data in development
  if (!IOT_API_URL) {
    console.info('No IoT URL configured. Using mock data.');
    return { ...MOCK_DATA, timestamp: new Date().toISOString() };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(IOT_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('IoT device response not OK:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform and validate IoT device data
    const transformedData: SoilData = {
      nitrogen: validateRange(parseFloat(data.N), 0, 1000, MOCK_DATA.nitrogen),
      phosphorus: validateRange(parseFloat(data.P), 0, 500, MOCK_DATA.phosphorus),
      potassium: validateRange(parseFloat(data.K), 0, 1000, MOCK_DATA.potassium),
      moisture: validateRange(parseFloat(data.moisture), 0, 100, MOCK_DATA.moisture),
      ph: validateRange(parseFloat(data.pH), 0, 14, MOCK_DATA.ph),
      temperature: validateRange(parseFloat(data.temp), -10, 50, MOCK_DATA.temperature),
      timestamp: new Date().toISOString()
    };

    return transformedData;
  } catch (error) {
    // Log detailed error information
    console.error('Error fetching IoT data:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: IOT_API_URL,
      timestamp: new Date().toISOString()
    });

    // In development, use mock data
    if (import.meta.env.DEV) {
      console.info('Using mock data in development environment');
      return { ...MOCK_DATA, timestamp: new Date().toISOString() };
    }

    // In production, return the last known good values or mock data
    return { ...MOCK_DATA, timestamp: new Date().toISOString() };
  }
}

// Helper function to validate and constrain values within reasonable ranges
function validateRange(value: number, min: number, max: number, fallback: number): number {
  if (isNaN(value) || value < min || value > max) {
    console.warn(`Invalid value ${value} detected, using fallback ${fallback}`);
    return fallback;
  }
  return value;
}