import React, { useState, useEffect } from "react";
import About from "./About";
import Contact from "./Contact";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../login/Login_page";
import SignupPage from "../login/Signup_page";
import { useNavigate } from "react-router-dom";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Home() {
 

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, login } = useAuth();

  // ✅ On mount, check if user email exists in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail && !user) {
      login({ email: storedEmail });
    }
  }, [login, user]);

  // ✅ When "Get Started" is clicked
  const handleGetStarted = () => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail || user) {
      navigate("/dashboard");
    } else {
      setModalOpen(true);
      setShowSignup(false);
    }
  };

  const handleLogin = (email, password) => {
    login({ email });
    localStorage.setItem("userEmail", email); // ✅ store email in localStorage
    setModalOpen(false);
  };

  const handleSignup = (email, password) => {
    login({ email });
    localStorage.setItem("userEmail", email); // ✅ store email in localStorage
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-100 relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 shadow backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5">
          <span className="text-2xl font-bold text-indigo-700 tracking-wide">PM-AJAY</span>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <button
              onClick={() => scrollToSection("home-section")}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact-section")}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              Contact
            </button>
          </div>

          <button
            onClick={handleGetStarted}
            className="hidden md:inline-block bg-indigo-700 text-white font-semibold rounded-lg px-6 py-2 shadow hover:bg-indigo-900 transition"
          >
            Get Started
          </button>

          {/* Hamburger Button */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded text-indigo-700 border-indigo-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="fill-current h-6 w-6" viewBox="0 0 24 24">
              {menuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3 bg-white bg-opacity-95 shadow-md">
            <button
              onClick={() => {
                scrollToSection("home-section");
                setMenuOpen(false);
              }}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                scrollToSection("about-section");
                setMenuOpen(false);
              }}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToSection("contact-section");
                setMenuOpen(false);
              }}
              className="px-3 py-2 rounded font-medium hover:bg-indigo-50 text-indigo-800 transition"
            >
              Contact
            </button>
            <button
              onClick={() => {
                handleGetStarted();
                setMenuOpen(false);
              }}
              className="px-3 py-2 rounded font-semibold bg-indigo-700 text-white text-center hover:bg-indigo-900 transition"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Home Hero */}
      <section
        id="home-section"
        className="min-h-screen flex flex-col justify-center items-center pt-24 md:pt-32 w-full"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-indigo-900 drop-shadow-lg">
            Unified Agency Dashboard for PM-AJAY
          </h1>
          <p className="text-xl md:text-2xl text-indigo-800 mb-2 font-medium">
            Modernize coordination, accelerate execution, and enable transparency—across every agency.
          </p>
          <ul className="flex flex-col md:flex-row md:flex-wrap gap-4 py-4 text-lg md:text-xl text-indigo-700 font-base justify-center items-center">
            <li>See all assigned tasks instantly</li>
            <li>Update progress with media uploads</li>
            <li>Track fund flow in real time</li>
            <li>Browse previous assignments</li>
            <li>Contact admins for live support</li>
          </ul>
          <button
            onClick={handleGetStarted}
            className="inline-block px-10 py-4 mt-3 mb-5 rounded-xl font-semibold bg-gradient-to-r from-indigo-700 to-blue-500 text-white shadow-xl hover:scale-105 transition"
          >
            Get Started
          </button>
        </div>
        <div className="w-20 h-2 mx-auto mt-6 rounded-full bg-indigo-300 opacity-70"></div>
      </section>

      {/* About Section */}
      <section
        id="about-section"
        className="min-h-screen flex flex-col justify-center items-center w-full bg-indigo-50 px-8 md:px-20 text-center"
      >
        <About />
      </section>

      {/* Contact Section */}
      <section
        id="contact-section"
        className="min-h-screen flex flex-col justify-center items-center w-full bg-blue-100 px-8 md:px-20 text-center"
      >
        <Contact />
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center bg-white bg-opacity-80 text-indigo-700 text-sm shadow mt-0">
        &copy; 2025 PM-AJAY Dashboard. All rights reserved.
      </footer>

      {/* Modal for Login/Signup */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {showSignup ? (
            <SignupPage
              onClose={() => setModalOpen(false)}
              onSwitch={() => setShowSignup(false)}
              onSignup={handleSignup}
            />
          ) : (
            <LoginPage
              onClose={() => setModalOpen(false)}
              onSwitch={() => setShowSignup(true)}
              onLogin={handleLogin}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
