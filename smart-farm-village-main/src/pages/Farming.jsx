import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";
import { useNavigate } from "react-router-dom";

const Farming = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const handleLanguageChange = (lang) => dispatch({ type: "SET_LANGUAGE", payload: lang });
  const farmingDetails = [
    getTranslation("farmingDetail1", state.language),
    getTranslation("farmingDetail2", state.language),
    getTranslation("farmingDetail3", state.language)
  ];
  const crops = [
    { name: getTranslation("wheat", state.language), season: getTranslation("rabi", state.language), route: "wheat" },
    { name: getTranslation("rice", state.language), season: getTranslation("kharif", state.language), route: "rice" },
    { name: getTranslation("cotton", state.language), season: getTranslation("kharif", state.language), route: "cotton" },
    { name: getTranslation("maize", state.language), season: getTranslation("kharif", state.language), route: "maize" },
    { name: getTranslation("potato", state.language), season: getTranslation("rabi", state.language), route: "potato" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">{getTranslation("farming", state.language)}</h2>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/")}>Exit</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='en'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('en')}>EN</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='hi'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('hi')}>हिंदी</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='pa'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('pa')}>ਪੰਜਾਬੀ</button>
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-8">{getTranslation("farmingDesc", state.language)}</p>
        <ul className="list-disc ml-6 text-gray-700 mb-8">
          {farmingDetails.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
        <h3 className="text-2xl font-bold text-green-600 mb-4">{getTranslation("seasonalCrops", state.language)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {crops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer animate-pop-in border border-green-200"
              onClick={() => navigate(`/docs/crops/${crop.route}`)}
            >
              <h4 className="text-xl font-semibold text-green-800 mb-2 underline hover:text-blue-700 transition-colors">{crop.name}</h4>
              <p className="text-gray-700">{getTranslation("season", state.language)}: {crop.season}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Farming;
