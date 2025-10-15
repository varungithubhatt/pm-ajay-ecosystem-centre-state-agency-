import React, { useState, useEffect } from "react";
import {
  FaUser, FaIdBadge, FaBriefcase, FaMapMarkerAlt, FaCity, FaEnvelope,
} from "react-icons/fa";

function stringToColor(str) {
  let hash = 0; for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
  let color = "#"; for (let i = 0; i < 3; i++) { color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2); }
  return color;
}

function ProfileAvatar({ name }) {
  const initials = name ? name[0].toUpperCase() : "U";
  const color = stringToColor(name || "U");
  return (
    <div
      className="w-32 h-32 flex items-center justify-center rounded-full shadow-2xl border-4 border-white"
      style={{
        background: `linear-gradient(135deg, ${color}40 0%, ${color} 100%)`,
        color: "#fff",
        fontWeight: "bold",
        fontSize: "2.6rem",
        position: "relative"
      }}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    post: "",
    accountId: "",
    state: "",
    city: "",
    email: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    setFormValid(
      !!formData.name &&
      !!formData.post &&
      !!formData.accountId &&
      !!formData.state &&
      !!formData.city &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) setSubmitted(true);
  };

  if (!submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-200">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl ring-1 ring-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Account Holder Name", name: "name", type: "text" },
              { label: "Account Holder Post", name: "post", type: "text" },
              { label: "Account Holder ID", name: "accountId", type: "text" },
              { label: "State Name", name: "state", type: "text" },
              { label: "City", name: "city", type: "text" },
              { label: "Email ID", name: "email", type: "email" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-700 mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                    formData[name].trim() === "" ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                {name === "email" &&
                  formData.email &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter a valid email address.
                    </p>
                  )}
              </div>
            ))}
            <button
              type="submit"
              disabled={!formValid}
              className={`w-full py-3 rounded-md text-white transition ${
                formValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Confirm & Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Pure Layout, No Card ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-200">
      {/* Top Bar | Banner | SVG Line */}
      <header className="w-full shadow-md z-20 relative">
        <div className="w-full h-40 bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-300 flex items-center px-14">
          <ProfileAvatar name={formData.name} />
          <div className="ml-7">
            <div className="text-3xl font-extrabold text-white mb-1 tracking-wide drop-shadow">
              Welcome, <span className="capitalize">{formData.name}</span>
            </div>
            <div className="text-base text-blue-50/90 font-medium drop-shadow">{formData.post} &middot; {formData.city}, {formData.state}</div>
          </div>
        </div>
        {/* SVG lines wave at bottom */}
        <svg viewBox="0 0 1500 80" className="absolute left-0 bottom-0 w-full h-20" fill="none">
          <path
            d="M0 40 Q375 80 750 40T1500 40V80H0V40Z"
            fill="#f8fafc" fillOpacity="0.33"
          />
        </svg>
      </header>

      {/* Profile Info, not in a card */}
      <main className="flex-1 w-full flex flex-col items-center py-12">
        <div className="text-3xl font-bold text-blue-700 mb-10 tracking-tight mt-4">Account Details</div>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 px-6">
          <div className="flex items-center border-b border-blue-100 pb-3 gap-4">
            <FaIdBadge className="text-blue-500 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">ACCOUNT ID</div>
              <div className="text-lg font-semibold text-gray-800">{formData.accountId}</div>
            </div>
          </div>
          <div className="flex items-center border-b border-indigo-100 pb-3 gap-4">
            <FaUser className="text-blue-600 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">HOLDER NAME</div>
              <div className="text-lg font-bold text-gray-900 capitalize">{formData.name}</div>
            </div>
          </div>
          <div className="flex items-center border-b border-purple-100 pb-3 gap-4">
            <FaBriefcase className="text-indigo-500 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">POST</div>
              <div className="text-lg font-semibold text-gray-800">{formData.post}</div>
            </div>
          </div>
          <div className="flex items-center border-b border-pink-100 pb-3 gap-4">
            <FaMapMarkerAlt className="text-fuchsia-500 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">STATE</div>
              <div className="text-lg font-semibold text-gray-800">{formData.state}</div>
            </div>
          </div>
          <div className="flex items-center border-b border-sky-100 pb-3 gap-4">
            <FaCity className="text-sky-500 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">CITY</div>
              <div className="text-lg font-semibold text-gray-800 capitalize">{formData.city}</div>
            </div>
          </div>
          <div className="flex items-center border-b border-emerald-100 pb-3 gap-4">
            <FaEnvelope className="text-emerald-500 w-7 h-7" />
            <div>
              <div className="text-xs tracking-widest text-gray-500 font-semibold">EMAIL ID</div>
              <a
                href={`mailto:${formData.email}`}
                className="text-lg text-blue-700 hover:underline break-all font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {formData.email}
              </a>
            </div>
          </div>
        </div>
        {/* About Block */}
        <div className="w-full max-w-4xl mt-12 px-6">
          <hr className="border-blue-100 my-4" />
          <div className="text-base font-semibold text-blue-800 mb-2">About Account Holder</div>
          <div className="text-gray-600 mb-8">
            No details yet. Contact <a href={`mailto:${formData.email}`} className="text-blue-700 underline">{formData.email}</a> for more information.
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-blue-100 text-gray-700 text-sm py-6 px-6 border-t border-blue-200 text-center w-full">
        &copy; {new Date().getFullYear()} PM-AJAY Profile Portal. All rights reserved.
      </footer>
    </div>
  );
}
