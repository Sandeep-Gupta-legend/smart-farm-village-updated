
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { getTranslation } from "@/utils/translations";
import "./Options.css";

const Options = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const items = [
    { name: getTranslation("crops", state.language), route: "/docs/crops", icon: "🌾" },
    { name: getTranslation("fertilizers", state.language), route: "/docs/fertilizers", icon: "🧪" },
    { name: getTranslation("pesticides", state.language), route: "/docs/pesticides", icon: "🛡️" },
    { name: getTranslation("farming", state.language), route: "/docs/farming", icon: "🚜" },
  ];

  const handleClick = (route) => {
    navigate(route);
  };
  return (
    <div className="options-container animate-options">
      {items.map((item, index) => (
        <div
          key={index}
          className="option-card option-animated"
          onClick={() => handleClick(item.route)}
          tabIndex={0}
          role="button"
          aria-label={`Go to ${item.name}`}
        >
          <span className="option-icon" style={{fontSize:'2.5rem'}}>{item.icon}</span>
          <h3 className="option-title">{item.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default Options;
