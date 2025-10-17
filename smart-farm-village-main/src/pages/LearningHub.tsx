import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, BookOpen, User, Home, Info, Phone, ArrowLeft, Globe } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useSearch, mockSearchLearning } from '@/hooks/useSearch';

const LearningHub = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const userName = location.state?.userName || 'Farmer';
  
  // Use the search hook
  const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchLearning);

  const handleLanguageChange = (language: 'en' | 'hi' | 'pa') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const renderNavbar = () => (
    <nav className="farm-navbar sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit
          </Button>
          <div className="flex space-x-6">
            {['home', 'about', 'contact', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'home' && <Home className="w-4 h-4 inline mr-2" />}
                {tab === 'about' && <Info className="w-4 h-4 inline mr-2" />}
                {tab === 'contact' && <Phone className="w-4 h-4 inline mr-2" />}
                {tab === 'profile' && <User className="w-4 h-4 inline mr-2" />}
                {getTranslation(tab, state.language)}
              </button>
            ))}
          </div>
        </div>
        <div className="text-white font-semibold">
          {getTranslation('welcome', state.language)}, {userName}
        </div>
      </div>
    </nav>
  );

  const renderSearchBar = () => (
    <SearchBar
      placeholder="Search crops, techniques, or advice..."
      onSearch={handleSearch}
      className="p-3 mb-8"
    />
  );

  const renderHomeContent = () => (
    <div className="space-y-8">
      {renderSearchBar()}
      
      {isSearching && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            Searching...
          </div>
        </div>
      )}

      {searchQuery && searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((item) => (
              <div key={item.id} className="farm-card group cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {item.type === 'Video' ? <Play className="w-4 h-4 text-blue-600" /> : 
                     item.type === 'Article' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
                     <Globe className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="text-sm text-gray-500">{item.type}</span>
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
        </div>
      )}

      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="farm-card group cursor-pointer" onClick={() => navigate('/documentation-learning')}>
          <BookOpen className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">{getTranslation('documentation', state.language)}</h3>
          <p className="text-muted-foreground">Written guides, crop information, and farming techniques</p>
        </div>
        
  <div className="farm-card group cursor-pointer" onClick={() => navigate('/video-learning')}>
          <Play className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">{getTranslation('video', state.language)}</h3>
          <p className="text-muted-foreground">Video tutorials and visual learning resources</p>
        </div>
        
        <div className="farm-card group cursor-pointer animate-pop-in pulse-glow" onClick={() => navigate('/scheme-support')}>
          <Globe className="w-12 h-12 text-primary mb-4 animate-bounceIn" />
          <h3 className="text-xl font-semibold mb-2">{getTranslation('schemes', state.language)}</h3>
          <p className="text-muted-foreground mb-4">Government schemes and financial support</p>
        </div>
        
        <div className="farm-card group cursor-pointer" onClick={() => navigate('/expert-advice')}>
          <User className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
          <p className="text-muted-foreground">Connect with agricultural experts</p>
        </div>
      </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="farm-card">
          <h3 className="text-2xl font-bold text-primary mb-4">Punjab Crops Information</h3>
          <div className="space-y-3">
            <div className="p-3 bg-secondary rounded-lg">
              <h4 className="font-semibold">Wheat (गेहूं)</h4>
              <p className="text-sm text-muted-foreground">Rabi crop, sowing: Nov-Dec, harvesting: Apr-May</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <h4 className="font-semibold">Rice (चावल)</h4>
              <p className="text-sm text-muted-foreground">Kharif crop, transplanting: Jun-Jul, harvesting: Oct-Nov</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <h4 className="font-semibold">Cotton (कपास)</h4>
              <p className="text-sm text-muted-foreground">Kharif crop, sowing: Apr-May, harvesting: Oct-Dec</p>
            </div>
          </div>
        </div>

        <div className="farm-card">
          <h3 className="text-2xl font-bold text-primary mb-4">Seasonal Guide</h3>
          <div className="space-y-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <h4 className="font-semibold">Rabi Season (Oct-Mar)</h4>
              <p className="text-sm text-muted-foreground">Wheat, barley, mustard, gram</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <h4 className="font-semibold">Kharif Season (Jun-Oct)</h4>
              <p className="text-sm text-muted-foreground">Rice, cotton, sugarcane, maize</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <h4 className="font-semibold">Zaid Season (Mar-Jun)</h4>
              <p className="text-sm text-muted-foreground">Fodder crops, watermelon, muskmelon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="max-w-2xl mx-auto">
      <div className="farm-card">
        <h3 className="text-2xl font-bold text-primary mb-6">Profile Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">User Name</label>
            <Input value={userName} disabled className="bg-muted" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{getTranslation('language', state.language)}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'हिंदी' },
                { code: 'pa', name: 'ਪੰਜਾਬੀ' }
              ].map((lang) => (
                <Button
                  key={lang.code}
                  variant={state.language === lang.code ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'pa')}
                  className="w-full"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'profile':
        return renderProfileContent();
      case 'about':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">About Smart Crop Advisory</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform empowers small and marginal farmers with cutting-edge agricultural knowledge, 
                market access, and government scheme information. We believe in sustainable farming practices 
                and helping farmers achieve better yields and income.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">Contact Us</h3>
              <div className="space-y-4">
                <p><strong>Email:</strong> support@smartcropadvisory.com</p>
                <p><strong>Phone:</strong> +91-9876543210</p>
                <p><strong>Address:</strong> Agriculture Innovation Center, Punjab, India</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNavbar()}
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default LearningHub;