import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import farmBackground from '@/assets/farm-background.jpg';
import farmingLogo from '@/assets/farming-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    const user = {
      ...formData,
      name: formData.username,
      id: Date.now().toString()
    };
    dispatch({ type: 'SET_USER', payload: user });
    
    if (type === 'buyer') {
      navigate('/buyer-marketplace');
    } else if (type === 'seller') {
      navigate('/seller-marketplace');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${farmBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md w-full animate-fade-scale">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img src={farmingLogo} alt="Logo" className="w-12 h-12" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {type?.charAt(0).toUpperCase() + type?.slice(1)} {getTranslation('login', state.language)}
          </h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('username', state.language)} *
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('password', state.language)} *
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold mt-6"
          >
            {getTranslation('login', state.language)}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate(`/${type}-register`)}
            className="text-primary"
          >
            Don't have an account? {getTranslation('register', state.language)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;