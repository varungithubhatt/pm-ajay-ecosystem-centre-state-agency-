import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onClose, onSwitch, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.message || "Invalid credentials", type: "error" });
        setLoading(false);
        return;
      }

      // ✅ Store user info in localStorage for UpdateProgress page
      // (use the exact keys UpdateProgress expects)
      if (data.user) {
        localStorage.setItem("email", data.user.email || email);
        localStorage.setItem("name", data.user.name || "");
        localStorage.setItem("contactInfo", data.user.contactInfo || data.user.contact || "");
      } else {
        // fallback in case backend only returns token or message
        localStorage.setItem("email", email);
      }

      setMessage({ text: "Login successful!", type: "success" });

      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
        onClose(); // Close modal
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ text: "Server error. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-80 relative">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Login</h2>

      {message.text && (
        <p
          className={`text-center mb-3 ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-700 text-white py-2 rounded font-semibold hover:bg-indigo-900 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-indigo-700 mt-4">
        Don't have an account?{" "}
        <span className="underline cursor-pointer" onClick={onSwitch}>
          Sign Up
        </span>
      </p>

      <button
        className="absolute top-2 right-2 text-indigo-700 font-bold"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}

export default Login;
