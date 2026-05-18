import React from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const options = [
  { name: 'Winter Farming', route: 'winter', icon: '❄️' },
  { name: 'Summer Farming', route: 'summer', icon: '☀️' },
  { name: 'Monsoon Farming', route: 'monsoon', icon: '🌧️' }
];

const SeasonalFarmingVideo = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <Navbar />
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in">Seasonal Farming</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in">Select a season to watch farming video guides and tips.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, idx) => (
            <div
              key={opt.route}
              className={`option-card option-animated`}
              style={{ animationDelay: `${0.1 * idx}s` }}
              onClick={() => navigate(`/video/seasonal-farming/${opt.route}`)}
            >
              <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>{opt.icon}</span>
              <h3 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-900 animate-slide-in">{opt.name}</h3>
              <p className="text-gray-600 text-center">Watch {opt.name} videos and guides.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalFarmingVideo;
