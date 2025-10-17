import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";

const fertilizerDetailsData = {
  urea: {
    title: "Urea",
    type: "Nitrogen",
    description: "High nitrogen content for leafy growth.",
    usage: "Apply during vegetative stage.",
    details: [
      "White crystalline solid, highly soluble in water.",
      "Promotes rapid vegetative growth.",
      "Recommended for wheat, rice, maize, and vegetables.",
      "Apply in split doses for best results."
    ]
  },
  dap: {
    title: "DAP",
    type: "Phosphorus",
    description: "Diammonium phosphate for root development.",
    usage: "Apply at planting time.",
    details: [
      "Granular fertilizer, contains both nitrogen and phosphorus.",
      "Improves root growth and flowering.",
      "Recommended for cereals, pulses, and oilseeds."
    ]
  },
  // Add more fertilizers as needed
};

const FertilizerDetails = () => {
  const { fertilizer } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const data = fertilizerDetailsData[fertilizer];

  if (!data) return <div className="p-8 text-center">Fertilizer not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="max-w-xl w-full p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in">
        <h2 className="text-4xl font-extrabold text-green-700 mb-2 animate-slide-in">{getTranslation(data.title.toLowerCase(), state.language)}</h2>
        <p className="text-lg text-gray-700 mb-2">{getTranslation("type", state.language)}: {getTranslation(data.type.toLowerCase(), state.language)}</p>
        <p className="text-lg text-gray-700 mb-2">{getTranslation("usage", state.language)}: {getTranslation(data.usage, state.language)}</p>
        <p className="text-gray-800 mb-4">{getTranslation(data.description, state.language)}</p>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          {data.details.map((detail, idx) => (
            <li key={idx}>{getTranslation(detail, state.language)}</li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/docs/fertilizers")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ⬅ {getTranslation("backToFertilizers", state.language)}
        </button>
          <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/fertilizers")}>Exit</button>
      </div>
    </div>
  );
};

export default FertilizerDetails;
