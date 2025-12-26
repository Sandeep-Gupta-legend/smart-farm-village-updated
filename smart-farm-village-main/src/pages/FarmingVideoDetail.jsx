import React from 'react';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router-dom';

const videoMap = {
  rice: 'https://www.youtube.com/embed/16v1QF2gA4kQ',
  wheat: 'https://www.youtube.com/embed/17v1QF2gA4kQ',
  sugarcane: 'https://www.youtube.com/embed/18v1QF2gA4kQ',
  maize: 'https://www.youtube.com/embed/19v1QF2gA4kQ',
  potato: 'https://www.youtube.com/embed/20v1QF2gA4kQ',
  cotton: 'https://www.youtube.com/embed/21v1QF2gA4kQ'
};

const FarmingVideoDetail = () => {
  const { crop } = useParams();
  if (!crop || !videoMap[crop]) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <Navbar />
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-8">Video Not Found</h1>
          <p className="text-gray-700">No video available for this crop.</p>
        </div>
      </div>
    );
  }
  const videoUrl = videoMap[crop];
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-green-800 mb-8 text-center">{crop.charAt(0).toUpperCase() + crop.slice(1)} Farming Video</h1>
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={videoUrl}
            title={`${crop} farming video`}
            allowFullScreen
            className="w-full h-64 rounded-lg border"
          />
        </div>
        <p className="text-gray-700 text-center">Watch the latest video about {crop} farming and related information.</p>
      </div>
    </div>
  );
};

export default FarmingVideoDetail;
