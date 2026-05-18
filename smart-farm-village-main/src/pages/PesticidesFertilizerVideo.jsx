import React from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const pesticides = [
  { name: 'Pesticide A', route: 'pesticide-a', icon: '🧪' },
  { name: 'Pesticide B', route: 'pesticide-b', icon: '🧴' },
  { name: 'Pesticide C', route: 'pesticide-c', icon: '🧫' }
];
const fertilizers = [
  { name: 'Fertilizer X', route: 'fertilizer-x', icon: '🌱' },
  { name: 'Fertilizer Y', route: 'fertilizer-y', icon: '🪴' },
  { name: 'Fertilizer Z', route: 'fertilizer-z', icon: '🌾' }
];

const PesticidesFertilizerVideo = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <Navbar />
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in">Pesticides & Fertilizer</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in">Select a pesticide or fertilizer to watch video tutorials and guides.</p>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-green-700 mb-4">Pesticides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pesticides.map((item, idx) => (
              <div
                key={item.route}
                className={`option-card option-animated`}
                style={{ animationDelay: `${0.1 * idx}s` }}
                onClick={() => navigate(`/video/pesticides-fertilizer/${item.route}`)}
              >
                <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>{item.icon}</span>
                <h3 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-900 animate-slide-in">{item.name}</h3>
                <p className="text-gray-600 text-center">Watch videos for {item.name}.</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-4">Fertilizers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fertilizers.map((item, idx) => (
              <div
                key={item.route}
                className={`option-card option-animated`}
                style={{ animationDelay: `${0.1 * idx}s` }}
                onClick={() => navigate(`/video/pesticides-fertilizer/${item.route}`)}
              >
                <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>{item.icon}</span>
                <h3 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-900 animate-slide-in">{item.name}</h3>
                <p className="text-gray-600 text-center">Watch videos for {item.name}.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesticidesFertilizerVideo;
