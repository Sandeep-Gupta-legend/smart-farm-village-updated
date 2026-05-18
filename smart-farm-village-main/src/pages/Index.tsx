import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import farmingLogo from '@/assets/farming-logo.png';
import farmBackground from '@/assets/farm-background.jpg';
import learnIcon from '@/assets/learn-icon.png';
import buyIcon from '@/assets/buy-icon.png';
import sellIcon from '@/assets/sell-icon.png';

const Index = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [nameInput, setNameInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (option === 'learn') {
      setShowNameInput(true);
    } else if (option === 'buy') {
      navigate('/buyer-register');
    } else if (option === 'sell') {
      navigate('/seller-register');
    }
  };

  const handleLearnSubmit = () => {
    if (nameInput.trim()) {
      navigate('/learning', { state: { userName: nameInput } });
    }
  };

  if (showNameInput) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 animate-fade-scale"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${farmBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl animate-fade-scale max-w-md w-full">
          <div className="text-center">
            <img src={farmingLogo} alt="Logo" className="w-16 h-16 mx-auto mb-4 floating-animation" />
            <h2 className="text-2xl font-bold text-primary mb-6 animate-slide-up">
              {getTranslation('welcome', state.language)}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={getTranslation('name', state.language)}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition-colors animate-fade-scale"
              />
              <button
                onClick={handleLearnSubmit}
                disabled={!nameInput.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 animate-slide-up"
              >
                Continue Learning
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                className="w-full text-primary hover:text-primary/80 transition-colors animate-fade-scale"
              >
                Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full text-red-600 hover:text-red-800 transition-colors animate-fade-scale border border-red-200 rounded-lg py-2 mt-2"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-scale"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${farmBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Exit Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg font-bold border bg-red-200 hover:bg-red-300 text-red-800 shadow-lg"
        >
          Exit
        </button>
      </div>
      {/* Header */}
      <div className="text-center mb-16 animate-slide-up">
        <img 
          src={farmingLogo} 
          alt="Smart Crop Advisory Logo" 
          className="w-24 h-24 mx-auto mb-6 floating-animation pulse-glow"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-scale">
          {getTranslation('title', state.language)}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
          {getTranslation('subtitle', state.language)}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-green-400 mx-auto rounded-full animate-fade-scale"></div>
      </div>

      {/* Main Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-16">
        {/* Learn Farming */}
        <div 
          className="circle-option animate-fade-scale group pulse-glow"
          style={{ animationDelay: '0.2s' }}
          onClick={() => handleOptionSelect('learn')}
        >
          <div className="relative z-10 text-center">
            <img 
              src={learnIcon} 
              alt="Learn Farming" 
              className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 floating-animation"
            />
            <h3 className="text-white font-bold text-lg animate-slide-up">
              {getTranslation('learnFarming', state.language)}
            </h3>
          </div>
        </div>

        {/* Buy Crops */}
        <div 
          className="circle-option animate-fade-scale group pulse-glow"
          style={{ animationDelay: '0.4s' }}
          onClick={() => handleOptionSelect('buy')}
        >
          <div className="relative z-10 text-center">
            <img 
              src={buyIcon} 
              alt="Buy Crops" 
              className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 floating-animation"
            />
            <h3 className="text-white font-bold text-lg animate-slide-up">
              {getTranslation('buyCrops', state.language)}
            </h3>
          </div>
        </div>

        {/* Sell Crops */}
        <div 
          className="circle-option animate-fade-scale group pulse-glow"
          style={{ animationDelay: '0.6s' }}
          onClick={() => handleOptionSelect('sell')}
        >
          <div className="relative z-10 text-center">
            <img 
              src={sellIcon} 
              alt="Sell Crops" 
              className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 floating-animation"
            />
            <h3 className="text-white font-bold text-lg animate-slide-up">
              {getTranslation('sellCrops', state.language)}
            </h3>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="farm-card animate-slide-up pulse-glow" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-bold text-primary mb-3 animate-fade-scale">Smart Learning</h3>
          <p className="text-muted-foreground animate-slide-up">
            Access comprehensive crop documentation, video tutorials, and expert guidance for better farming practices.
          </p>
        </div>
        
        <div className="farm-card animate-slide-up pulse-glow" style={{ animationDelay: '1s' }}>
          <h3 className="text-xl font-bold text-primary mb-3 animate-fade-scale">Quality Marketplace</h3>
          <p className="text-muted-foreground animate-slide-up">
            Buy and sell crops directly with verified farmers and buyers. Secure transactions and fair pricing guaranteed.
          </p>
        </div>
        
        <div className="farm-card animate-slide-up pulse-glow" style={{ animationDelay: '1.2s' }}>
          <h3 className="text-xl font-bold text-primary mb-3 animate-fade-scale">Government Schemes</h3>
          <p className="text-muted-foreground animate-slide-up">
            Stay updated with latest agricultural schemes, subsidies, and support programs from government initiatives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
