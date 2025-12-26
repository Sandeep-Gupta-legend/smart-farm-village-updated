import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";
import SearchBar from "@/components/SearchBar";
import { useSearch, mockSearchLearning } from "@/hooks/useSearch";

const Fertilizers = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchLearning);
  const handleLanguageChange = (lang) => dispatch({ type: "SET_LANGUAGE", payload: lang });

  const fertilizerData = [
    {
      id: 1,
      name: getTranslation("urea", state.language),
      type: getTranslation("nitrogen", state.language),
      description: getTranslation("ureaDesc", state.language),
      usage: getTranslation("ureaUsage", state.language),
      details: [
        getTranslation("ureaDetail1", state.language),
        getTranslation("ureaDetail2", state.language)
      ]
    },
    {
      id: 2,
      name: getTranslation("dap", state.language),
      type: getTranslation("phosphorus", state.language),
      description: getTranslation("dapDesc", state.language),
      usage: getTranslation("dapUsage", state.language),
      details: [
        getTranslation("dapDetail1", state.language),
        getTranslation("dapDetail2", state.language)
      ]
    },
    {
      id: 3,
      name: getTranslation("potash", state.language),
      type: getTranslation("potassium", state.language),
      description: getTranslation("potashDesc", state.language),
      usage: getTranslation("potashUsage", state.language),
      details: [
        getTranslation("potashDetail1", state.language)
      ]
    },
    {
      id: 4,
      name: getTranslation("npk", state.language),
      type: getTranslation("mixed", state.language),
      description: getTranslation("npkDesc", state.language),
      usage: getTranslation("npkUsage", state.language),
      details: [
        getTranslation("npkDetail1", state.language)
      ]
    },
    {
      id: 5,
      name: getTranslation("compost", state.language),
      type: getTranslation("organic", state.language),
      description: getTranslation("compostDesc", state.language),
      usage: getTranslation("compostUsage", state.language),
      details: [
        getTranslation("compostDetail1", state.language)
      ]
    },
    {
      id: 6,
      name: getTranslation("vermicompost", state.language),
      type: getTranslation("organic", state.language),
      description: getTranslation("vermicompostDesc", state.language),
      usage: getTranslation("vermicompostUsage", state.language),
      details: [
        getTranslation("vermicompostDetail1", state.language)
      ]
    }
  ];

  const filteredFertilizers = searchQuery 
    ? fertilizerData.filter(fertilizer => 
        fertilizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fertilizer.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fertilizer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fertilizer.usage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : fertilizerData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">{getTranslation("fertilizers", state.language)}</h1>
            <p className="text-lg text-gray-600">{getTranslation("fertilizersDesc", state.language)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/")}>Exit</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='en'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('en')}>EN</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='hi'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('hi')}>हिंदी</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='pa'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('pa')}>ਪੰਜਾਬੀ</button>
          </div>
        </div>

        <SearchBar
          placeholder={getTranslation("searchFertilizers", state.language)}
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

        {searchQuery && filteredFertilizers.length === 0 && !isSearching && (
          <div className="text-center py-8">
            <p className="text-gray-500">{getTranslation("noFertilizersFound", state.language)} "{searchQuery}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFertilizers.map((fertilizer) => (
            <div
              key={fertilizer.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer animate-pop-in"
              onClick={() => navigate(`/docs/fertilizers/${fertilizer.name.toLowerCase()}`)}
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2 underline hover:text-blue-700 transition-colors">{fertilizer.name}</h3>
              <div className="space-y-2">
                <p><span className="font-medium">{getTranslation("type", state.language)}:</span> {fertilizer.type}</p>
                <p className="text-gray-600">{fertilizer.description}</p>
                <p><span className="font-medium">{getTranslation("usage", state.language)}:</span> {fertilizer.usage}</p>
                <ul className="list-disc ml-6 text-gray-700">
                  {fertilizer.details.map((detail, idx) => (
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

export default Fertilizers;
