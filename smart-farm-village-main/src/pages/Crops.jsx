import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";
import SearchBar from "@/components/SearchBar";
import { useSearch, mockSearchLearning } from "@/hooks/useSearch";

const Crops = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchLearning);
  const handleLanguageChange = (lang) => dispatch({ type: "SET_LANGUAGE", payload: lang });

  const cropData = [
    {
      id: 1,
      name: getTranslation("wheat", state.language),
      season: getTranslation("rabi", state.language),
      duration: "4-5",
      description: getTranslation("wheatDesc", state.language),
      details: [
        getTranslation("wheatDetail1", state.language),
        getTranslation("wheatDetail2", state.language),
        getTranslation("wheatDetail3", state.language)
      ]
    },
    {
      id: 2,
      name: getTranslation("rice", state.language),
      season: getTranslation("kharif", state.language),
      duration: "3-4",
      description: getTranslation("riceDesc", state.language),
      details: [
        getTranslation("riceDetail1", state.language),
        getTranslation("riceDetail2", state.language),
        getTranslation("riceDetail3", state.language)
      ]
    },
    {
      id: 3,
      name: getTranslation("cotton", state.language),
      season: getTranslation("kharif", state.language),
      duration: "5-6",
      description: getTranslation("cottonDesc", state.language),
      details: [
        getTranslation("cottonDetail1", state.language),
        getTranslation("cottonDetail2", state.language)
      ]
    },
    {
      id: 4,
      name: getTranslation("sugarcane", state.language),
      season: getTranslation("kharif", state.language),
      duration: "10-12",
      description: getTranslation("sugarcaneDesc", state.language),
      details: [
        getTranslation("sugarcaneDetail1", state.language)
      ]
    },
    {
      id: 5,
      name: getTranslation("maize", state.language),
      season: getTranslation("kharif", state.language),
      duration: "3-4",
      description: getTranslation("maizeDesc", state.language),
      details: [
        getTranslation("maizeDetail1", state.language)
      ]
    },
    {
      id: 6,
      name: getTranslation("potato", state.language),
      season: getTranslation("rabi", state.language),
      duration: "3-4",
      description: getTranslation("potatoDesc", state.language),
      details: [
        getTranslation("potatoDetail1", state.language)
      ]
    }
  ];

  const filteredCrops = searchQuery 
    ? cropData.filter(crop => 
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.season.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cropData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">{getTranslation("crops", state.language)}</h1>
            <p className="text-lg text-gray-600">{getTranslation("cropsDesc", state.language)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/")}>Exit</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='en'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('en')}>EN</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='hi'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('hi')}>हिंदी</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='pa'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('pa')}>ਪੰਜਾਬੀ</button>
          </div>
        </div>

        <SearchBar
          placeholder={getTranslation("searchCrops", state.language)}
          onSearch={handleSearch}
          className="mb-8"
        />

        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              {getTranslation("searching", state.language)}
            </div>
          </div>
        )}

        {searchQuery && filteredCrops.length === 0 && !isSearching && (
          <div className="text-center py-8">
            <p className="text-gray-500">{getTranslation("noCropsFound", state.language)} "{searchQuery}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer animate-pop-in"
              onClick={() => navigate(`/docs/crops/${crop.name.toLowerCase()}`)}
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2 underline hover:text-blue-700 transition-colors">{crop.name}</h3>
              <div className="space-y-2">
                <p><span className="font-medium">{getTranslation("season", state.language)}:</span> {crop.season}</p>
                <p><span className="font-medium">{getTranslation("duration", state.language)}:</span> {crop.duration} {getTranslation("months", state.language)}</p>
                <p className="text-gray-600">{crop.description}</p>
                <ul className="list-disc ml-6 text-gray-700">
                  {crop.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/documentation-learning")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            ⬅ {getTranslation("backToDocs", state.language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Crops;
