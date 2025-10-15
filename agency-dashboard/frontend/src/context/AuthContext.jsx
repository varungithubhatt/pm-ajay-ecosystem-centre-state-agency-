import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: check localStorage for persisted login
    const savedUser = JSON.parse(localStorage.getItem("pmAjayUser"));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("pmAjayUser", JSON.stringify(userData));
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pmAjayUser");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
