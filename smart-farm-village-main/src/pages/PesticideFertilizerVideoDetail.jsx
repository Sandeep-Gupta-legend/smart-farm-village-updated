import React from 'react';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router-dom';

const videoMap = {
  'pesticide-a': 'https://www.youtube.com/embed/7v1QF2gA4kQ',
  'pesticide-b': 'https://www.youtube.com/embed/8v1QF2gA4kQ',
  'pesticide-c': 'https://www.youtube.com/embed/9v1QF2gA4kQ',
  'fertilizer-x': 'https://www.youtube.com/embed/10v1QF2gA4kQ',
  'fertilizer-y': 'https://www.youtube.com/embed/11v1QF2gA4kQ',
  'fertilizer-z': 'https://www.youtube.com/embed/12v1QF2gA4kQ'
};

const PesticideFertilizerVideoDetail = () => {
  const { name } = useParams();
  if (!name || !videoMap[name]) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <Navbar />
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-8">Video Not Found</h1>
          <p className="text-gray-700">No video available for this option.</p>
        </div>
      </div>
    );
  }
  const videoUrl = videoMap[name];
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-green-800 mb-8 text-center">{name.replace(/-/g, ' ').toUpperCase()} Video</h1>
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={videoUrl}
            title={`${name} video`}
            allowFullScreen
            className="w-full h-64 rounded-lg border"
          />
        </div>
        <p className="text-gray-700 text-center">Watch the latest video about {name.replace(/-/g, ' ')} and best practices.</p>
      </div>
    </div>
  );
};

export default PesticideFertilizerVideoDetail;
