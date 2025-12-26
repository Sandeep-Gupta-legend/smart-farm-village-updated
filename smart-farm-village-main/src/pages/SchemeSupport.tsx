import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const schemes = [
  {
    icon: '🌱',
    name: 'PM Kisan Samman Nidhi',
    desc: 'Direct income support for farmers. Check eligibility and apply online.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    icon: '🚜',
    name: 'Subsidy for Agri Machinery',
    desc: 'Government subsidy for purchasing agricultural machinery and equipment.',
    link: 'https://agrimachinery.nic.in/'
  },
  {
    icon: '🧪',
    name: 'Soil Health Card Scheme',
    desc: 'Get your soil tested and receive recommendations for better crop yield.',
    link: 'https://soilhealth.dac.gov.in/'
  }
];

const SchemeSupport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filteredSchemes = schemes.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 animate-fade-in">
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in mt-16 relative">
        {/* Exit Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 px-4 py-2 rounded-lg font-bold border bg-red-200 hover:bg-red-300 text-red-800 shadow-lg transition-all duration-300 animate-slide-in"
        >
          Exit
        </button>
        <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in mb-8 text-center">Scheme Support</h2>
        <SearchBar
          placeholder="Search schemes..."
          onSearch={setSearch}
          enableMic={true}
          enableCamera={true}
          enableStorage={true}
          className="mb-8"
        />
        <div className="flex flex-col gap-8">
          {filteredSchemes.length === 0 ? (
            <div className="text-center text-gray-500 animate-fade-in">No schemes found.</div>
          ) : (
            filteredSchemes.map((scheme, idx) => (
              <a
                key={scheme.name}
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="option-card option-animated w-full h-36 flex flex-col items-center justify-center text-base font-semibold hover:scale-105 transition-transform duration-300 animate-pop-in"
                style={{animationDelay: `${0.1 * idx}s`}}
              >
                <span className="option-icon" style={{fontSize:'2.2rem', marginBottom:'0.7rem'}}>{scheme.icon}</span>
                <span className="text-green-800 mb-1 text-lg font-bold">{scheme.name}</span>
                <span className="text-gray-700 text-center mb-1">{scheme.desc}</span>
                <span className="text-blue-600 underline">Visit Scheme</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeSupport;
