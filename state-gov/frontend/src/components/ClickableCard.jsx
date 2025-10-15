import React from "react";
import { useNavigate } from "react-router-dom";

function ClickableCard({ title, description, destination }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(destination)}
      className={`cursor-pointer max-w-2xl h-full p-6  rounded-lg
        bg-gradient-to-tr from-white via-gray-50 to-white
        shadow-lg border border-gray-300 transform transition-transform duration-500 ease-in-out
        hover:scale-110 hover:shadow-2xl hover:from-gray-400/30 hover:via-gray-300/40 hover:to-gray-400/30
        ring-2 ring-transparent 
        hover:rotate-1 hover:-translate-y-1
        text-gray-900
        select-none
        `}
      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
    >
      <h3 className="text-2xl  font-bold mb-3">{title}</h3>
      <p className="text-blue-800 leading-relaxed">{description}</p>
    </div>
  );
}

export default ClickableCard;
