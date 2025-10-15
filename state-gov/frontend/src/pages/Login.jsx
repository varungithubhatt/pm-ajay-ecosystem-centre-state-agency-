import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const defaultFormData = {
  stateName: "",
  officialEmail: "",
  password: "",
  contactName: "",
  phone: "",
};

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -40, transition: { duration: 0.4, ease: "easeIn" } },
};

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("pmAjayToken");
    const storedUser = localStorage.getItem("pmAjayUser");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (isSignup) {
        const res = await axios.post("http://localhost:4000/api/auth/signup", formData);
        setMessage(res.data.message || "Registration successful! Please login now.");
        setIsSignup(false);
        setFormData(defaultFormData);
      } else {
        const res = await axios.post("http://localhost:4000/api/auth/login", {
          officialEmail: formData.officialEmail,
          password: formData.password,
        });
        setUser(res.data.user);
        localStorage.setItem("pmAjayToken", res.data.token);
        localStorage.setItem("pmAjayUser", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "An unexpected error occurred.");
    }
    setLoading(false);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("pmAjayToken");
    localStorage.removeItem("pmAjayUser");
    setFormData(defaultFormData);
    setIsSignup(false);
    navigate("/login");
  }

  // 🆕 Skip button functionality
  function handleSkip() {
    navigate("/dashboard");
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-700 p-6">
        <motion.h1
          className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg"
          initial="hidden"
          animate="visible"
        >
          Welcome, {user.contactName} ({user.stateName})
        </motion.h1>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full space-y-6"
        >
          <p className="text-gray-900"><strong>Email:</strong> {user.officialEmail}</p>
          <p className="text-gray-900"><strong>Contact Name:</strong> {user.contactName}</p>
          <p className="text-gray-900"><strong>Phone:</strong> {user.phone || "-"}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-100 to-blue-100">
      <div className="flex shadow-2xl rounded-3xl overflow-hidden max-w-4xl w-full">
        {/* Blue side: Info, logos, icons */}
        <div className="hidden md:flex flex-col items-center justify-center bg-blue-700 text-white w-1/2 p-12 relative">
          <svg className="w-16 h-16 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="17" stroke="white" strokeWidth="5" />
            <ellipse cx="20" cy="20" rx="7" ry="17" stroke="white" strokeWidth="2" />
          </svg>
          <h2 className="text-3xl font-bold mb-4">Connect with every application</h2>
          <p className="text-lg text-blue-100 mb-8 text-center">
            Secure access for state government officials. Login or register to continue.
          </p>
        </div>

        {/* White side: Form */}
        <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isSignup ? "signup" : "login"}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <h2 className="text-3xl font-extrabold p-6 text-center text-blue-900 mb-3">
                {isSignup ? "State Government Official Signup" : "State Government Official Login"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignup && (
                  <>
                    <input
                      type="text"
                      name="stateName"
                      placeholder="State Name"
                      value={formData.stateName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder-blue-400 text-lg"
                    />
                    <input
                      type="text"
                      name="contactName"
                      placeholder="Contact Name"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder-blue-400 text-lg"
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder-blue-400 text-lg"
                    />
                  </>
                )}
                <input
                  type="email"
                  name="officialEmail"
                  placeholder="Official Email"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder-blue-400 text-lg"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 placeholder-blue-400 text-lg"
                />
                {message && <p className="text-center text-red-600 font-medium">{message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl bg-blue-700 text-white text-xl font-bold shadow-lg transition hover:scale-105
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
                </button>

                {/* 🆕 Skip button added here */}
                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full mt-3 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold shadow transition hover:scale-105"
                >
                  Skip & Go to Dashboard
                </button>
              </form>

              <p className="text-center text-blue-900 font-medium mt-4">
                {isSignup ? (
                  <>
                    Already registered?{" "}
                    <button
                      onClick={() => {
                        setIsSignup(false);
                        setMessage("");
                      }}
                      className="text-blue-700 underline hover:text-blue-800"
                    >
                      Log In
                    </button>
                  </>
                ) : (
                  <>
                    New user?{" "}
                    <button
                      onClick={() => {
                        setIsSignup(true);
                        setMessage("");
                      }}
                      className="text-blue-700 underline hover:text-blue-800"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
