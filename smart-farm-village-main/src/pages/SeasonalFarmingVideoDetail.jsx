import React from 'react';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router-dom';

const videoMap = {
  winter: 'https://www.youtube.com/embed/13v1QF2gA4kQ',
  summer: 'https://www.youtube.com/embed/14v1QF2gA4kQ',
  monsoon: 'https://www.youtube.com/embed/15v1QF2gA4kQ'
};

const SeasonalFarmingVideoDetail = () => {
  const { season } = useParams();
  if (!season || !videoMap[season]) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <Navbar />
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-8">Video Not Found</h1>
          <p className="text-gray-700">No video available for this season.</p>
        </div>
      </div>
    );
  }
  const videoUrl = videoMap[season];
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-green-800 mb-8 text-center">{season.charAt(0).toUpperCase() + season.slice(1)} Farming Video</h1>
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={videoUrl}
            title={`${season} farming video`}
            allowFullScreen
            className="w-full h-64 rounded-lg border"
          />
        </div>
        <p className="text-gray-700 text-center">Watch the latest video about {season} farming and related options.</p>
      </div>
    </div>
  );
};

export default SeasonalFarmingVideoDetail;
