import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";

const cropDetailsData = {
  wheat: {
    title: "Wheat",
    season: "Rabi",
    duration: "4-5 months",
    description: "Main cereal crop of Punjab. High yield, staple food, grown in winter season.",
    details: [
      "Requires well-drained loamy soil.",
      "Sowing: November-December.",
      "Harvesting: April-May.",
      "Major varieties: PBW 343, HD 2967, WH 1105.",
      "Fertilizer: NPK (Nitrogen, Phosphorus, Potassium) recommended.",
      "Irrigation: 4-5 times during growth."
    ]
  },
  rice: {
    title: "Rice",
    season: "Kharif",
    duration: "3-4 months",
    description: "Staple food crop. Requires abundant water, grown in monsoon season.",
    details: [
      "Requires clayey soil and standing water.",
      "Transplanting: June-July.",
      "Harvesting: October-November.",
      "Major varieties: PR 126, PR 121, Pusa Basmati.",
      "Fertilizer: Urea, DAP, Potash recommended.",
      "Irrigation: Continuous flooding."
    ]
  },
  // Add more crops as needed
};

const CropDetails = () => {
  const { crop } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const data = cropDetailsData[crop];

  if (!data) return <div className="p-8 text-center">Crop not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="max-w-xl w-full p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in">
        <h2 className="text-4xl font-extrabold text-green-700 mb-2 animate-slide-in">{getTranslation(data.title.toLowerCase(), state.language)}</h2>
        <p className="text-lg text-gray-700 mb-2">{getTranslation("season", state.language)}: {getTranslation(data.season.toLowerCase(), state.language)}</p>
        <p className="text-lg text-gray-700 mb-2">{getTranslation("duration", state.language)}: {data.duration}</p>
        <p className="text-gray-800 mb-4">{getTranslation(data.description, state.language)}</p>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          {data.details.map((detail, idx) => (
            <li key={idx}>{getTranslation(detail, state.language)}</li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/docs/crops")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ⬅ {getTranslation("backToCrops", state.language)}
        </button>
          <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/crops")}>Exit</button>
      </div>
    </div>
  );
};

export default CropDetails;
