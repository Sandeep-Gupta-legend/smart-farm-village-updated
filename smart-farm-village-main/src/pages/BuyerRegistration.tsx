import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import farmBackground from '@/assets/farm-background.jpg';
import farmingLogo from '@/assets/farming-logo.png';
import ApiService from '@/services/api';
import { toast } from 'sonner';

const BuyerRegistration = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    mobile: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        userType: 'buyer',
        state: 'Punjab' // Default state, can be made dynamic
      };
      
      const response = await ApiService.register(userData);
      
      if (response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
        toast.success('Registration successful!');
        navigate('/buyer-marketplace');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            Buyer {getTranslation('registration', state.language)}
          </h2>
          <p className="text-muted-foreground">Join our marketplace to buy quality crops</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('name', state.language)} *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('age', state.language)} *
            </label>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('address', state.language)} *
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {getTranslation('mobile', state.language)} *
            </label>
            <Input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

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
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold mt-6"
          >
            {isLoading ? 'Registering...' : getTranslation('register', state.language)}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate('/login/buyer')}
            className="text-primary"
          >
            Already have an account? {getTranslation('login', state.language)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegistration;