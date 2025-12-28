import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import SearchBar from './SearchBar';
import { User, LogOut, Leaf } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-lg fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 rounded-lg font-bold border bg-green-200 hover:bg-green-300 text-green-800"
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button
          className="px-3 py-1 rounded-lg font-bold border bg-blue-200 hover:bg-blue-300 text-blue-800"
          onClick={() => navigate('/about')}
        >
          About
        </button>
        <button
          className="px-3 py-1 rounded-lg font-bold border bg-yellow-200 hover:bg-yellow-300 text-yellow-800 flex items-center gap-1"
          onClick={() => navigate('/crop-map')}
          title="View India's Agricultural Map"
        >
          <Leaf size={16} /> Crop Map
        </button>
        <button
          className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300 text-red-800"
          onClick={() => navigate(-1)}
        >
          Exit
        </button>
      </div>
      <div className="flex-1 flex justify-center">
        <SearchBar enableMic enableCamera enableStorage onSearch={() => {}} />
      </div>
      <div className="flex items-center gap-3">
        {state.user ? (
          <>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-300"
              onClick={() => navigate(state.user.userType === 'buyer' ? '/buyer-profile' : '/seller-profile')}
            >
              <User size={18} /> {state.user.firstName}
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-300 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              onClick={() => navigate('/login/buyer')}
            >
              Login Buyer
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
              onClick={() => navigate('/login/seller')}
            >
              Login Seller
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
