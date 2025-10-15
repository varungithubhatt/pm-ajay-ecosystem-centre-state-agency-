import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/user/${email}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchUserData();
  }, [email]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-indigo-700 text-lg font-semibold">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-red-600 text-lg font-semibold">
          No user data found!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <Navbar />

      <div className="pt-24 flex justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-10 border border-gray-100">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-[2px] rounded-full">
              <div className="bg-white rounded-full p-2">
                <FaUserCircle className="text-gray-600 text-8xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">{userData.name}</h2>
            <p className="text-gray-500">{userData.agencyType}</p>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact</p>
              <p className="font-semibold">{userData.contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">State</p>
              <p className="font-semibold">{userData.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">District</p>
              <p className="font-semibold">{userData.district}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Bank Account</p>
              <p className="font-semibold">{userData.bankAcc}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t mt-8 mb-6"></div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => alert("Edit feature coming soon!")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl shadow transition-all"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
