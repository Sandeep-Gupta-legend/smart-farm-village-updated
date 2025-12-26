import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";

const pesticideDetailsData = {
  chlorpyrifos: {
    title: "Chlorpyrifos",
    description: "Broad-spectrum insecticide for pest control.",
    details: [
      "Effective against termites, beetles, and borers.",
      "Apply as soil drench or foliar spray.",
      "Use recommended dose to avoid phytotoxicity."
    ]
  },
  imidacloprid: {
    title: "Imidacloprid",
    description: "Systemic insecticide for sucking pests.",
    details: [
      "Controls aphids, jassids, and whiteflies.",
      "Apply as seed treatment or foliar spray.",
      "Safe for most crops when used as directed."
    ]
  },
  // Add more pesticides as needed
};

const PesticideDetails = () => {
  const { pesticide } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const data = pesticideDetailsData[pesticide];

  if (!data) return <div className="p-8 text-center">Pesticide not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="max-w-xl w-full p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-200 animate-pop-in">
        <h2 className="text-4xl font-extrabold text-green-700 mb-2 animate-slide-in">{getTranslation(data.title.toLowerCase(), state.language)}</h2>
        <p className="text-gray-800 mb-4">{getTranslation(data.description, state.language)}</p>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          {data.details.map((detail, idx) => (
            <li key={idx}>{getTranslation(detail, state.language)}</li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/docs/pesticides")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ⬅ {getTranslation("backToPesticides", state.language)}
        </button>
          <button className="px-3 py-1 rounded-lg font-bold border bg-red-200 hover:bg-red-300" onClick={()=>navigate("/pesticides")}>Exit</button>
      </div>
    </div>
  );
};

export default PesticideDetails;
