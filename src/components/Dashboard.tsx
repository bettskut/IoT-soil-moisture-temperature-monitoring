import React, { useState, useEffect } from 'react';
import NutrientPanel from './NutrientPanel';
import SoilConditionsPanel from './SoilConditionsPanel';
import PlantRecommendations from './PlantRecommendations';
import { getSoilData } from '../services/soilDataService';
import { SoilData } from '../types/soilData';
import { RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const data = await getSoilData();
      setSoilData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Soil Monitoring Dashboard
        </h1>
        <button 
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NutrientPanel 
          nitrogen={soilData?.nitrogen ?? 0} 
          phosphorus={soilData?.phosphorus ?? 0} 
          potassium={soilData?.potassium ?? 0} 
        />
        <SoilConditionsPanel 
          moisture={soilData?.moisture ?? 0} 
          ph={soilData?.ph ?? 7} 
        />
      </div>
      
      <PlantRecommendations soilData={soilData} />
    </div>
  );
};

export default Dashboard;