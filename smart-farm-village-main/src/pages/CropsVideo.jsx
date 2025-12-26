
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import '../components/ui/Options.css';

const crops = [
  { name: 'Rice', route: 'rice', icon: '🌾' },
  { name: 'Wheat', route: 'wheat', icon: '🌿' },
  { name: 'Sugarcane', route: 'sugarcane', icon: '🍬' },
  { name: 'Maize', route: 'maize', icon: '🌽' },
  { name: 'Potato', route: 'potato', icon: '🥔' },
  { name: 'Cotton', route: 'cotton', icon: '🧵' }
];

const CropsVideo = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <Navbar />
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in">Crops</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in">Select a crop to watch video tutorials and guides.</p>
        <div className="options-container animate-options">
          {crops.map((crop, idx) => (
            <div
              key={crop.route}
              className="option-card option-animated"
              style={{ animationDelay: `${0.1 * idx}s` }}
              onClick={() => navigate(`/video/crops/${crop.route}`)}
              tabIndex={0}
              role="button"
              aria-label={`Go to ${crop.name}`}
            >
              <span className="option-icon" style={{fontSize:'2.5rem'}}>{crop.icon}</span>
              <h3 className="option-title">{crop.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropsVideo;
