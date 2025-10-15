import React from "react";
import { useNavigate } from "react-router-dom"; // Use this if you are using React Router v6+

function App() {
  const navigate = useNavigate(); // Correct way to get navigation function

  return (
    <>
      <button
        className="text-blue-500"
        onClick={() => navigate("/Login")} // Use 'navigate', not 'Navigate'
      >
        home page
      </button>
    </>
  );
}

export default App;
