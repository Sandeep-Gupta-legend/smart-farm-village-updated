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
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Check if username and password are provided
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          userType: type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Login failed. Please try again.');
        return;
      }

      // Persist token for authenticated API calls
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      const user = {
        id: data?.user?.id || data?.user?._id || Date.now().toString(),
        name: data?.user?.name || formData.username,
        username: data?.user?.username || formData.username,
        userType: data?.user?.userType || type,
        token: data?.token,
      } as any;

      dispatch({ type: 'SET_USER', payload: user });
      setError('');

      if (type === 'buyer') {
        navigate('/buyer-marketplace');
      } else if (type === 'seller') {
        navigate('/seller-marketplace');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Login failed. Please try again.');
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

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

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