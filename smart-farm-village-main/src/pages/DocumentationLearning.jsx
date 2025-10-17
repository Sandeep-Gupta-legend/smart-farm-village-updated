
import React from "react";
import Options from "../components/ui/Options.jsx";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";

const DocumentationLearning = () => {
  const { state, dispatch } = useAppContext();
  const handleLanguageChange = (lang) => dispatch({ type: "SET_LANGUAGE", payload: lang });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in">{getTranslation('documentation', state.language)}</h2>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='en'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('en')}>EN</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='hi'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('hi')}>हिंदी</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='pa'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('pa')}>ਪੰਜਾਬੀ</button>
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in">{getTranslation('subtitle', state.language)}</p>
        <Options />
      </div>
    </div>
  );
};

export default DocumentationLearning;
