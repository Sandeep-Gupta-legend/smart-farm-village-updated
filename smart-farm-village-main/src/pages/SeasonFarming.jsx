import React from "react";
import { useNavigate } from "react-router-dom";

const SeasonFarming = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Season Farming</h2>
      <p>Information about seasonal crops and farming techniques for each season.</p>

      <button
        onClick={() => navigate("/docs")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ⬅ Back to Documentation Learning
      </button>
    </div>
  );
};

export default SeasonFarming;

