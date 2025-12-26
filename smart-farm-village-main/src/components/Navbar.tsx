import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
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
          className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300 text-red-800"
          onClick={() => navigate(-1)}
        >
          Exit
        </button>
      </div>
      <div className="flex-1 flex justify-center">
        <SearchBar enableMic enableCamera enableStorage onSearch={() => {}} />
      </div>
    </nav>
  );
};

export default Navbar;
