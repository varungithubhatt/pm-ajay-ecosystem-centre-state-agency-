import React, { useState } from "react";
import ClickableCard from "../components/ClickableCard.jsx";
import ProfilePage from "./ProfilePage.jsx";
import { useNavigate } from "react-router-dom";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pmAjayToken");
    localStorage.removeItem("pmAjayUser");
    // Close sidebar if open
    setIsSidebarOpen(false);
    // Navigate to login page or reload
    navigate("/");
  };

  return (
    <>
      {/* Top bar */}
      <header className="bg-gray-400 shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-black">Dashboard</div>

        {/* 3-dot button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </header>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sliding sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-gray-300 shadow-lg z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded hover:bg-gray-200 transition"
          >
            &#x2715;
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <a href="/profile" className="block text-black hover:text-blue-600">
            Profile
          </a>
          <a href="/funds" className="block text-black hover:text-blue-600">
            Funds
          </a>
          <a href="/settings" className="block text-black hover:text-blue-600">
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left text-black hover:text-blue-600 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 px-6 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Your cards */}
          <ClickableCard title="Villages" description="Check the details..." destination="/villages-list" />
          <ClickableCard title="Agencies Directory Page" description="See the available Agencies in your state..." destination="/ngos" />
          <ClickableCard title="Progress" description="take a look of progress..." destination="/progress" />
          <ClickableCard title="Monitoring Page" description="How much task has been done..." destination="/tasks" />
          
        </div>
        {/* Add below the grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-xl font-bold text-blue-700">Total Funds</div>
            <div className="text-2xl mt-2 font-extrabold text-green-600">₹2,45,00,000</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-xl font-bold text-teal-700">Active NGOs</div>
            <div className="text-2xl mt-2 font-extrabold text-teal-600">14</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-xl font-bold text-purple-700">Tasks Done</div>
            <div className="text-2xl mt-2 font-extrabold text-purple-600">23</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-xl font-bold text-yellow-700">Alerts</div>
            <div className="mt-2 text-yellow-900">2 pending approvals</div>
          </div>
        </div>

        {/* Recent NGOs Table */}
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <div className="text-xl font-bold text-gray-700 mb-4">Recently Registered NGOs</div>
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>State</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 font-semibold text-teal-700">Green Bharat</td>
                <td className="text-gray-600">UP</td>
                <td className="text-gray-600">2025-10-01</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-teal-700">Sahara Foundation</td>
                <td className="text-gray-600">MP</td>
                <td className="text-gray-600">2025-09-29</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-teal-700">Child Help India</td>
                <td className="text-gray-600">Delhi</td>
                <td className="text-gray-600">2025-09-27</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recent Monitoring Alerts */}
        <div className="mt-10 bg-yellow-50 rounded-xl shadow p-6">
          <div className="text-lg font-bold text-yellow-700 mb-2">Monitoring Alerts</div>
          <ul className="text-yellow-900">
            <li>Task deadline for "District Health Check" in 2 days.</li>
            <li>Field Survey (Bihar) pending review.</li>
            <li>Monitoring feedback required for NGO: Sahara Foundation.</li>
          </ul>
        </div>

        {/* Transparency/Progress Summary */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow p-6 flex items-center">
          <div className="flex-1">
            <div className="text-lg font-bold text-blue-800 mb-2">Transparency Score</div>
            <div className="text-2xl font-extrabold text-green-700">92%</div>
            <div className="text-gray-600 mt-1">All NGO records up to date. Public view is enabled.</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-blue-800 mb-2">Fund Utilization Progress</div>
            <div className="relative w-full h-4 bg-gray-200 rounded-full mt-1 mb-1">
              <div className="absolute top-0 left-0 h-4 bg-blue-400 rounded-full" style={{ width: "74%" }}></div>
            </div>
            <div className="text-gray-800 text-sm mt-1">₹1,81,30,000 / ₹2,45,00,000 used</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
