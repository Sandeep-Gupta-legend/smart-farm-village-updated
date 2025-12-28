import React, { useState, useMemo } from 'react';
import { MapPin, Leaf, Calendar, Filter, ChevronDown, TrendingUp, Zap, Droplets } from 'lucide-react';

interface CropData {
  name: string;
  seasons: string[];
  regions: string[];
  production: number;
  icon: string;
}

interface StateData {
  name: string;
  stateCode: string;
  crops: string[];
  climate: string;
  coordinates: { x: number; y: number };
  production: number;
  status: 'high' | 'medium' | 'low';
  temperature: number;
  rainfall: number;
  soilType: string;
}

const IndianCropMap: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'regions' | 'crops' | 'status'>('regions');

  // Comprehensive crop data for India
  const cropsData: Record<string, CropData> = {
    rice: {
      name: 'Rice',
      seasons: ['Kharif', 'Rabi'],
      regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Bihar', 'Assam', 'Chhattisgarh'],
      production: 120,
      icon: '🌾'
    },
    wheat: {
      name: 'Wheat',
      seasons: ['Rabi'],
      regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Jammu and Kashmir', 'Himachal Pradesh', 'Uttarakhand'],
      production: 100,
      icon: '🌾'
    },
    cotton: {
      name: 'Cotton',
      seasons: ['Kharif'],
      regions: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Madhya Pradesh', 'Karnataka'],
      production: 35,
      icon: '🌾'
    },
    sugarcane: {
      name: 'Sugarcane',
      seasons: ['Kharif', 'Rabi'],
      regions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Punjab', 'Haryana'],
      production: 380,
      icon: '🌾'
    },
    corn: {
      name: 'Corn',
      seasons: ['Kharif', 'Rabi'],
      regions: ['Karnataka', 'Madhya Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu', 'Telangana'],
      production: 26,
      icon: '🌾'
    },
    soybean: {
      name: 'Soybean',
      seasons: ['Kharif'],
      regions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
      production: 12,
      icon: '🌾'
    },
    tea: {
      name: 'Tea',
      seasons: ['Spring', 'Summer', 'Autumn'],
      regions: ['Assam', 'Himachal Pradesh', 'Tamil Nadu', 'Kerala', 'West Bengal', 'Sikkim'],
      production: 14,
      icon: '🍵'
    },
    coffee: {
      name: 'Coffee',
      seasons: ['Year-round'],
      regions: ['Karnataka', 'Kerala', 'Tamil Nadu'],
      production: 8,
      icon: '☕'
    },
    coconut: {
      name: 'Coconut',
      seasons: ['Year-round'],
      regions: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Odisha'],
      production: 21,
      icon: '🥥'
    },
    spices: {
      name: 'Spices',
      seasons: ['Kharif', 'Rabi'],
      regions: ['Kerala', 'Karnataka', 'Telangana', 'Gujarat', 'Rajasthan'],
      production: 10,
      icon: '🌶️'
    }
  };

  // All 29 Indian States/UTs with comprehensive data (accurately positioned on transparent PNG India map)
  const statesData: Record<string, StateData> = {
    'Jammu and Kashmir': { name: 'Jammu and Kashmir', stateCode: 'JK', crops: ['rice', 'wheat'], climate: 'Temperate', coordinates: { x: 32, y: 12 }, production: 8, status: 'low', temperature: 14, rainfall: 1100, soilType: 'Alluvial & Mountain' },
    'Himachal Pradesh': { name: 'Himachal Pradesh', stateCode: 'HP', crops: ['tea', 'wheat'], climate: 'Temperate', coordinates: { x: 38, y: 17 }, production: 5, status: 'low', temperature: 12, rainfall: 2250, soilType: 'Loamy' },
    'Punjab': { name: 'Punjab', stateCode: 'PB', crops: ['wheat', 'rice', 'corn', 'sugarcane'], climate: 'Subtropical Monsoon', coordinates: { x: 34, y: 21 }, production: 35, status: 'high', temperature: 23, rainfall: 800, soilType: 'Alluvial' },
    'Uttarakhand': { name: 'Uttarakhand', stateCode: 'UK', crops: ['rice', 'wheat'], climate: 'Temperate', coordinates: { x: 44, y: 19 }, production: 8, status: 'low', temperature: 18, rainfall: 1800, soilType: 'Loamy & Mountain' },
    'Haryana': { name: 'Haryana', stateCode: 'HR', crops: ['wheat', 'rice', 'corn'], climate: 'Semi-Arid', coordinates: { x: 38, y: 25 }, production: 28, status: 'high', temperature: 24, rainfall: 750, soilType: 'Sandy Loam' },
    'Uttar Pradesh': { name: 'Uttar Pradesh', stateCode: 'UP', crops: ['wheat', 'rice', 'sugarcane', 'corn'], climate: 'Subtropical', coordinates: { x: 48, y: 28 }, production: 50, status: 'high', temperature: 25, rainfall: 1000, soilType: 'Alluvial & Black' },
    'Rajasthan': { name: 'Rajasthan', stateCode: 'RJ', crops: ['wheat', 'corn', 'soybean'], climate: 'Arid & Semi-Arid', coordinates: { x: 28, y: 32 }, production: 20, status: 'medium', temperature: 28, rainfall: 600, soilType: 'Sandy & Red' },
    'Bihar': { name: 'Bihar', stateCode: 'BR', crops: ['rice', 'corn', 'wheat'], climate: 'Subtropical Monsoon', coordinates: { x: 60, y: 30 }, production: 25, status: 'medium', temperature: 26, rainfall: 1200, soilType: 'Alluvial & Clay' },
    'Sikkim': { name: 'Sikkim', stateCode: 'SK', crops: ['tea'], climate: 'Temperate & Alpine', coordinates: { x: 66, y: 25 }, production: 2, status: 'low', temperature: 10, rainfall: 3500, soilType: 'Loamy' },
    'Arunachal Pradesh': { name: 'Arunachal Pradesh', stateCode: 'AR', crops: ['rice'], climate: 'Temperate & Alpine', coordinates: { x: 76, y: 22 }, production: 5, status: 'low', temperature: 15, rainfall: 2200, soilType: 'Laterite' },
    'Nagaland': { name: 'Nagaland', stateCode: 'NL', crops: ['rice'], climate: 'Tropical Monsoon', coordinates: { x: 78, y: 30 }, production: 3, status: 'low', temperature: 23, rainfall: 1800, soilType: 'Laterite' },
    'Manipur': { name: 'Manipur', stateCode: 'MN', crops: ['rice'], climate: 'Tropical Monsoon', coordinates: { x: 78, y: 35 }, production: 4, status: 'low', temperature: 24, rainfall: 1700, soilType: 'Alluvial' },
    'Mizoram': { name: 'Mizoram', stateCode: 'MZ', crops: ['rice'], climate: 'Tropical Monsoon', coordinates: { x: 80, y: 38 }, production: 3, status: 'low', temperature: 22, rainfall: 2600, soilType: 'Laterite' },
    'Tripura': { name: 'Tripura', stateCode: 'TR', crops: ['rice'], climate: 'Tropical Monsoon', coordinates: { x: 75, y: 36 }, production: 5, status: 'low', temperature: 25, rainfall: 2200, soilType: 'Laterite & Alluvial' },
    'Meghalaya': { name: 'Meghalaya', stateCode: 'ML', crops: ['rice'], climate: 'Tropical Monsoon', coordinates: { x: 72, y: 32 }, production: 4, status: 'low', temperature: 22, rainfall: 2500, soilType: 'Laterite' },
    'Assam': { name: 'Assam', stateCode: 'AS', crops: ['rice', 'tea'], climate: 'Tropical Monsoon', coordinates: { x: 74, y: 29 }, production: 20, status: 'medium', temperature: 26, rainfall: 2250, soilType: 'Alluvial' },
    'West Bengal': { name: 'West Bengal', stateCode: 'WB', crops: ['rice', 'tea'], climate: 'Subtropical Monsoon', coordinates: { x: 66, y: 34 }, production: 28, status: 'high', temperature: 26, rainfall: 1600, soilType: 'Alluvial & Laterite' },
    'Jharkhand': { name: 'Jharkhand', stateCode: 'JH', crops: ['rice', 'corn'], climate: 'Tropical Monsoon', coordinates: { x: 60, y: 37 }, production: 12, status: 'medium', temperature: 26, rainfall: 1450, soilType: 'Red & Laterite' },
    'Odisha': { name: 'Odisha', stateCode: 'OD', crops: ['rice', 'coconut'], climate: 'Tropical Monsoon', coordinates: { x: 62, y: 45 }, production: 22, status: 'medium', temperature: 27, rainfall: 1500, soilType: 'Laterite & Red' },
    'Chhattisgarh': { name: 'Chhattisgarh', stateCode: 'CG', crops: ['rice', 'corn'], climate: 'Tropical Monsoon', coordinates: { x: 54, y: 43 }, production: 20, status: 'medium', temperature: 27, rainfall: 1400, soilType: 'Black & Red' },
    'Madhya Pradesh': { name: 'Madhya Pradesh', stateCode: 'MP', crops: ['wheat', 'cotton', 'soybean', 'corn'], climate: 'Subtropical', coordinates: { x: 42, y: 38 }, production: 32, status: 'high', temperature: 26, rainfall: 1200, soilType: 'Black & Red' },
    'Gujarat': { name: 'Gujarat', stateCode: 'GJ', crops: ['cotton', 'wheat', 'corn'], climate: 'Semi-Arid', coordinates: { x: 25, y: 40 }, production: 30, status: 'high', temperature: 27, rainfall: 650, soilType: 'Black & Loamy' },
    'Maharashtra': { name: 'Maharashtra', stateCode: 'MH', crops: ['cotton', 'sugarcane', 'soybean'], climate: 'Tropical Monsoon', coordinates: { x: 38, y: 50 }, production: 38, status: 'high', temperature: 27, rainfall: 1500, soilType: 'Black Soil' },
    'Telangana': { name: 'Telangana', stateCode: 'TG', crops: ['cotton', 'spices', 'corn'], climate: 'Tropical Monsoon', coordinates: { x: 48, y: 52 }, production: 18, status: 'medium', temperature: 27, rainfall: 900, soilType: 'Black & Red' },
    'Andhra Pradesh': { name: 'Andhra Pradesh', stateCode: 'AP', crops: ['rice', 'corn', 'cotton', 'spices'], climate: 'Tropical Monsoon', coordinates: { x: 51, y: 59 }, production: 45, status: 'high', temperature: 28, rainfall: 1000, soilType: 'Black & Red' },
    'Karnataka': { name: 'Karnataka', stateCode: 'KA', crops: ['coffee', 'coconut', 'corn', 'cotton'], climate: 'Tropical Monsoon', coordinates: { x: 40, y: 62 }, production: 35, status: 'high', temperature: 26, rainfall: 1500, soilType: 'Black & Red' },
    'Goa': { name: 'Goa', stateCode: 'GA', crops: ['coconut', 'spices'], climate: 'Tropical Monsoon', coordinates: { x: 33, y: 59 }, production: 3, status: 'low', temperature: 28, rainfall: 3000, soilType: 'Laterite' },
    'Tamil Nadu': { name: 'Tamil Nadu', stateCode: 'TN', crops: ['rice', 'tea', 'coconut', 'corn'], climate: 'Tropical Monsoon', coordinates: { x: 45, y: 72 }, production: 32, status: 'high', temperature: 27, rainfall: 1200, soilType: 'Black & Red' },
    'Kerala': { name: 'Kerala', stateCode: 'KL', crops: ['tea', 'spices', 'coconut', 'coffee'], climate: 'Tropical Monsoon', coordinates: { x: 37, y: 76 }, production: 20, status: 'medium', temperature: 27, rainfall: 3000, soilType: 'Laterite' }
  };

  const seasons = ['Kharif', 'Rabi', 'Summer', 'Spring', 'Autumn', 'Year-round'];

  // Filter crops based on selections
  const filteredCrops = useMemo(() => {
    return Object.entries(cropsData).filter(([key, crop]) => {
      let matches = true;

      if (selectedCrop !== 'all' && key !== selectedCrop) {
        matches = false;
      }

      if (selectedSeason !== 'all' && !crop.seasons.includes(selectedSeason)) {
        matches = false;
      }

      if (selectedRegion && !crop.regions.includes(selectedRegion)) {
        matches = false;
      }

      return matches;
    });
  }, [selectedCrop, selectedSeason, selectedRegion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper function to get status color
  const getStatusColor = (status: 'high' | 'medium' | 'low'): string => {
    switch (status) {
      case 'high':
        return '#22c55e'; // green
      case 'medium':
        return '#eab308'; // yellow
      case 'low':
        return '#ef4444'; // red
      default:
        return '#9ca3af';
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: 'high' | 'medium' | 'low'): string => {
    switch (status) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
    }
  };

  const filteredCropsByRegion = useMemo(() => {
    const filteredStates = Object.entries(statesData).filter(([_, state]) => {
      if (selectedCrop !== 'all') {
        return state.crops.some(crop => 
          Object.keys(cropsData).find(key => cropsData[key].name.toLowerCase() === crop.toLowerCase()) === selectedCrop
        );
      }
      return true;
    });
    return filteredStates;
  }, [selectedCrop, cropsData, statesData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Leaf className="w-12 h-12 text-green-600" />
            India's Agricultural Map
          </h1>
          <p className="text-xl text-gray-600">Discover crops by region and season</p>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          {/* Season Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="all">All Seasons</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <Leaf className="w-5 h-5 text-green-600" />
              Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="all">All Crops</option>
              {Object.entries(cropsData).map(([key, crop]) => (
                <option key={key} value={key}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* State/Region Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <MapPin className="w-5 h-5 text-red-600" />
              State/Region
            </label>
            <select
              value={selectedRegion || ''}
              onChange={(e) => setSelectedRegion(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="">All States</option>
              {Object.values(statesData).map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* India Map Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All 29 Indian States/UTs</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMapView('crops')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    mapView === 'crops'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Crops
                </button>
                <button
                  onClick={() => setMapView('status')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    mapView === 'status'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Production Status
                </button>
              </div>
            </div>
            
            <div className="relative">
              <svg viewBox="0 0 100 100" className="w-full h-auto" style={{maxHeight: '600px'}} >
                {/* India map background image */}
                <defs>
                  <pattern id="indiaMap" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <image 
                      href="http://www.pngmart.com/files/7/India-Map-PNG-Transparent-HD-Photo.png" 
                      x="5" 
                      y="5" 
                      width="90" 
                      height="90"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </pattern>
                  <linearGradient id="mapOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(240,248,255,0.2)" />
                    <stop offset="100%" stopColor="rgba(224,242,254,0.2)" />
                  </linearGradient>
                </defs>

                {/* Map background with India map image */}
                <rect width="100" height="100" fill="#f0f9ff" />
                <rect width="100" height="100" fill="url(#indiaMap)" />
                <rect width="100" height="100" fill="url(#mapOverlay)" />

                {/* State regions with visible borders */}
                {Object.entries(statesData).map(([key, state]) => {
                  const isSelected = selectedState === key;
                  const statusColor = getStatusColor(state.status);
                  const baseColor = mapView === 'status' ? statusColor : '#86efac';
                  
                  return (
                    <g key={key}>
                      {/* State border region - rectangular shape */}
                      <rect
                        x={state.coordinates.x - 4}
                        y={state.coordinates.y - 3}
                        width="8"
                        height="6"
                        fill={isSelected ? baseColor : `${baseColor}80`}
                        stroke={isSelected ? '#000000' : '#1f2937'}
                        strokeWidth={isSelected ? '0.8' : '0.6'}
                        rx="1"
                        className="cursor-pointer transition-all duration-300 hover:stroke-black hover:stroke-[1]"
                        onClick={() => setSelectedState(isSelected ? null : key)}
                        opacity={selectedState && selectedState !== key ? 0.5 : 0.95}
                        style={{
                          filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,0,0,0.6))' : 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
                        }}
                      />
                      
                      {/* State code label */}
                      <text
                        x={state.coordinates.x}
                        y={state.coordinates.y + 1}
                        fontSize="1.6"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#ffffff"
                        className="pointer-events-none select-none"
                        style={{
                          textShadow: '0 0 4px black, 0 0 4px black, 0 0 4px black'
                        }}
                      >
                        {state.stateCode}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Status Legend */}
            {mapView === 'status' && (
              <div className="mt-6 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#22c55e'}}></div>
                  <span className="font-semibold">High Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#eab308'}}></div>
                  <span className="font-semibold">Medium Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#ef4444'}}></div>
                  <span className="font-semibold">Low Production</span>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4 text-center">
              Click on any state to view detailed information
            </p>
          </div>

          {/* State Details Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            {selectedState && statesData[selectedState] ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{statesData[selectedState].name}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                      statesData[selectedState].status === 'high' ? 'bg-green-500' :
                      statesData[selectedState].status === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {getStatusLabel(statesData[selectedState].status)} Production
                    </span>
                    <span className="text-gray-600 font-semibold">{statesData[selectedState].stateCode}</span>
                  </div>
                </div>

                {/* Climate and Environmental Data */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Climate</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{statesData[selectedState].climate}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                    <p className="text-xs text-gray-600 font-semibold uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Temperature
                    </p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{statesData[selectedState].temperature}°C</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
                    <p className="text-xs text-gray-600 font-semibold uppercase flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Rainfall
                    </p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{statesData[selectedState].rainfall}mm</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Soil Type</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{statesData[selectedState].soilType}</p>
                  </div>
                </div>

                {/* Production Stats */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Annual Production</p>
                  <p className="text-lg font-bold text-green-600 mt-1">{statesData[selectedState].production} Million Tons</p>
                </div>

                {/* Major Crops */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Major Crops
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {statesData[selectedState].crops.map((cropName) => {
                      const crop = Object.values(cropsData).find(c => c.name.toLowerCase() === cropName.toLowerCase());
                      return (
                        <span
                          key={cropName}
                          className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-1 hover:bg-green-200 transition-colors"
                        >
                          {crop?.icon || '🌾'} {crop?.name || cropName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold">Select a state to view details</p>
                <p className="text-gray-400 text-sm mt-2">Click on any state circle on the map</p>
              </div>
            )}
          </div>
        </div>

        {/* State Selector Grid */}
        <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.35s'}}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick State Selection (All 29 States)</h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3 bg-white rounded-3xl p-8 shadow-2xl">
            {Object.entries(statesData).map(([key, state]) => (
              <button
                key={key}
                onClick={() => setSelectedState(selectedState === key ? null : key)}
                className={`py-3 px-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                  selectedState === key
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
                }`}
                title={state.name}
              >
                {state.stateCode}
              </button>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {/* Seasons Info */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-7 h-7" />
              Crop Seasons
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <span><strong>Kharif:</strong> June to October (Monsoon)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <span><strong>Rabi:</strong> October to March (Winter)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <span><strong>Summer:</strong> April to June (Hot)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <span><strong>Year-round:</strong> Perennial crops</span>
              </li>
            </ul>
          </div>

          {/* Climate Info */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Leaf className="w-7 h-7" />
              Regional Climate
            </h3>
            <ul className="space-y-3">
              {['Tropical Monsoon', 'Subtropical', 'Temperate', 'Arid & Semi-Arid'].map((climate) => (
                <li key={climate} className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  <span>{climate}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Learning Button */}
        <div className="mt-12 flex justify-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <a
            href="http://localhost:8081/learning"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
          >
            <Leaf className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Learn More about Farming
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" style={{transform: 'rotate(270deg)'}} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default IndianCropMap;
