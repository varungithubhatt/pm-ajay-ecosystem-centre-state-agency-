import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // for profile icon

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 w-screen bg-white shadow-md rounded-b-lg p-4 z-50 flex items-center justify-between">
      {/* Left Menu Button */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-indigo-800 text-xl font-bold cursor-pointer"
        >
          PM-AJAY
        </button>

        {menuOpen && (
          <ul className="absolute left-0 top-12 w-52 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            {[
              "Profile",
              "Home",
              "Dashboard",
              "Tasks",
              "Funds",
              "Progress",
              "Previous Tasks",
            ].map((option) => (
              <li
                key={option}
                className="px-4 py-2 cursor-pointer text-indigo-700 hover:bg-indigo-100"
                onClick={() => {
                  setMenuOpen(false);
                  if (option === "Profile") handleNavClick("/profile");
                  else if (option === "Home") handleNavClick("/");
                  else if (option === "Tasks") handleNavClick("/task");
                  else if (option === "Funds") handleNavClick("/funds");
                  else if (option === "Progress")
                    handleNavClick("/progress");
                  else if (option === "Previous Tasks")
                    handleNavClick("/previous-tasks");
                  else if (option === "Dashboard") handleNavClick("/dashboard");
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Profile Button */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="text-indigo-800 text-3xl hover:text-indigo-600 transition-colors"
        >
          <FaUserCircle />
        </button>

        {profileOpen && (
          <ul className="absolute right-0 top-12 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            <li
              className="px-4 py-2 cursor-pointer text-indigo-700 hover:bg-indigo-100"
              onClick={() => {
                setProfileOpen(false);
                navigate("/profile");
              }}
            >
              Profile
            </li>
            <li
              className="px-4 py-2 cursor-pointer text-red-600 hover:bg-red-100"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;