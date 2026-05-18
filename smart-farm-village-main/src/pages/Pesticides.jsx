import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";

const Pesticides = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const handleLanguageChange = (lang) => dispatch({ type: "SET_LANGUAGE", payload: lang });

  const pesticideData = [
    {
      id: 1,
      name: getTranslation("chlorpyrifos", state.language),
      description: getTranslation("chlorpyrifosDesc", state.language),
      details: [
        getTranslation("chlorpyrifosDetail1", state.language),
        getTranslation("chlorpyrifosDetail2", state.language)
      ]
    },
    {
      id: 2,
      name: getTranslation("imidacloprid", state.language),
      description: getTranslation("imidaclopridDesc", state.language),
      details: [
        getTranslation("imidaclopridDetail1", state.language)
      ]
    },
    {
      id: 3,
      name: getTranslation("carbendazim", state.language),
      description: getTranslation("carbendazimDesc", state.language),
      details: [
        getTranslation("carbendazimDetail1", state.language)
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">{getTranslation("pesticides", state.language)}</h2>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/")}>Exit</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='en'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('en')}>EN</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='hi'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('hi')}>हिंदी</button>
            <button className={`px-3 py-1 rounded-lg font-bold border ${state.language==='pa'?'bg-green-200':'bg-white'}`} onClick={()=>handleLanguageChange('pa')}>ਪੰਜਾਬੀ</button>
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-8">{getTranslation("pesticidesDesc", state.language)}</p>
        <div className="space-y-6 mb-8">
          {pesticideData.map((pest) => (
            <div
              key={pest.id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer animate-pop-in"
              onClick={() => navigate(`/docs/pesticides/${pest.name.toLowerCase()}`)}
            >
              <h3 className="text-xl font-bold text-green-700 mb-2 underline hover:text-blue-700 transition-colors">{pest.name}</h3>
              <p className="text-gray-700 mb-2">{pest.description}</p>
              <ul className="list-disc ml-6 text-gray-700">
                {pest.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/documentation-learning")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ⬅ {getTranslation("backToDocs", state.language)}
        </button>
      </div>
    </div>
  );
};

export default Pesticides;
