import React from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const VideoLearning = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <Navbar />
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in">Video Learning</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in">Watch tutorials and visual guides for crops, farming, and more.</p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <button
            className="option-card option-animated w-48 h-40 flex flex-col items-center justify-center text-xl font-bold"
            style={{animationDelay: '0.1s'}}
            onClick={() => navigate('/video/crops')}
          >
            <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>🌾</span>
            Crops
          </button>
          <button
            className="option-card option-animated w-48 h-40 flex flex-col items-center justify-center text-xl font-bold"
            style={{animationDelay: '0.2s'}}
            onClick={() => navigate('/video/pesticides-fertilizer')}
          >
            <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>🧪</span>
            Pesticides & Fertilizer
          </button>
          <button
            className="option-card option-animated w-48 h-40 flex flex-col items-center justify-center text-xl font-bold"
            style={{animationDelay: '0.3s'}}
            onClick={() => navigate('/video/seasonal-farming')}
          >
            <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>❄️</span>
            Seasonal Farming
          </button>
          <button
            className="option-card option-animated w-48 h-40 flex flex-col items-center justify-center text-xl font-bold"
            style={{animationDelay: '0.4s'}}
            onClick={() => navigate('/video/farming')}
          >
            <span className="option-icon" style={{fontSize:'2.5rem', marginBottom:'1rem'}}>🌽</span>
            Farming
          </button>
        </div>

      </div>
    </div>
  );
};

export default VideoLearning;
