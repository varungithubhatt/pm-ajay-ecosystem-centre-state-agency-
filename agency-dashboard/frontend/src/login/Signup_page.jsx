import React, { useState } from "react";

function Signup({ onClose, onSwitch, onSignup }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    agencyType: "",
    state: "",
    district: "",
    bankAcc: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const states = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Delhi: ["New Delhi"],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.message || "Signup failed", type: "error" });
        return;
      }

      setMessage({ text: "Signup successful! You can now log in.", type: "success" });
      setTimeout(onSwitch, 1500);
    } catch {
      setMessage({ text: "Server error. Please try again.", type: "error" });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-[24rem] sm:w-[30rem] relative">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
        Agency Sign Up
      </h2>

      {message.text && (
        <p
          className={`text-center mb-3 ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <form
        className="flex flex-col gap-4 overflow-y-auto max-h-[34rem]" // ✅ increased height
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          type="text"
          name="name"
          placeholder="Name of Official"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Official Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Set Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="new-password" // ✅ no password autofill
          required
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off"
          required
        />

        <select
          name="agencyType"
          value={formData.agencyType}
          onChange={handleChange}
          className="border p-2 rounded text-gray-700"
          required
        >
          <option value="">Select Agency Type</option>
          <option value="Construction">Construction</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="border p-2 rounded text-gray-700"
          required
        >
          <option value="">Select State</option>
          {Object.keys(states).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* ✅ District shown by default but disabled until state chosen */}
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className={`border p-2 rounded text-gray-700 ${
            !formData.state ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={!formData.state}
          required
        >
          <option value="">
            {formData.state ? "Select District" : "Select State First"}
          </option>
          {formData.state &&
            states[formData.state].map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>

        <input
          type="text"
          name="bankAcc"
          placeholder="Bank Account Number"
          value={formData.bankAcc}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off" // ✅ no autofill
          required
        />

        

        <button
          type="submit"
          className="bg-indigo-700 text-white py-2 rounded font-semibold hover:bg-indigo-900 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-indigo-700 mt-4">
        Already have an account?{" "}
        <span className="underline cursor-pointer" onClick={onSwitch}>
          Login
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

export default Signup;
