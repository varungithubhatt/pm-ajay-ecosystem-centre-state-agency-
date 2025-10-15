import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = "http://localhost:5000/api/progress";

function UpdateProgress() {
  const { villageID } = useParams();
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("email") || "";
  const storedName = localStorage.getItem("name") || "";
  const storedContact =
    localStorage.getItem("contactInfo") || localStorage.getItem("contact") || "";

  const [userEmail, setUserEmail] = useState(storedEmail);
  const [userName, setUserName] = useState(storedName);
  const [contactInfo, setContactInfo] = useState(storedContact);
  const [villagedata, setVillagedata] = useState(null);

  const [totalFunds, setTotalFunds] = useState(""); 
  const [reports, setReports] = useState([
    { title: "Current Condition Report", description: "", photos: [], videos: [], aiChecked: false, submitted: false },
    { title: "Progress Report 1", description: "", photos: [], videos: [], aiChecked: false, submitted: false, extraInput: "" },
    { title: "Progress Report 2", description: "", photos: [], videos: [], aiChecked: false, submitted: false, extraInput: "" },
    { title: "Progress Report 3", description: "", photos: [], videos: [], aiChecked: false, submitted: false, extraInput: "" },
    { title: "Final Completion Report", description: "", photos: [], videos: [], aiChecked: false, submitted: false, extraInput: "" },
  ]);

  const [aiLoading, setAiLoading] = useState(Array(5).fill(false));
  const [aiProgress, setAiProgress] = useState(Array(5).fill(0));

  const photoRefs = useRef([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks?villageID=${villageID}`);
        const data = await res.json();
        if (res.ok && data.length > 0) setVillagedata(data[0]);

        const fundsRes = await fetch(`http://localhost:5000/api/village-funds?villageID=${villageID}`);
        const fundsData = await fundsRes.json();
        if (fundsRes.ok && fundsData.fundsAllocated) {
          setTotalFunds(fundsData.fundsAllocated);
        }
      } catch (err) {
        console.error("Error fetching village or funds:", err);
      }
    };

    const fetchProgress = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`${API_BASE}/${villageID}/${encodeURIComponent(userEmail)}`);
        if (!res.ok) return;
        const progress = await res.json();
        if (progress && progress.reports) {
          const mapped = progress.reports.map((r, i) => ({
            title: r.title || reports[i].title,
            description: r.description || "",
            photos: Array.isArray(r.photos) ? r.photos : [],
            videos: Array.isArray(r.videos) ? r.videos : [],
            aiChecked: !!r.aiChecked,
            submitted: !!r.submitted,
            extraInput: r.extraInput || "",
          }));
          setReports((prev) => mapped.map((m, i) => ({ ...prev[i], ...m })));
          if (progress.totalFundsAllocated) setTotalFunds(progress.totalFundsAllocated);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchVillage();
    fetchProgress();
  }, [villageID, userEmail]);

  const handleFileChange = (index, fileList, type) => {
    const newReports = [...reports];
    const arr = Array.from(fileList);
    if (type === "photo") newReports[index].photos = arr;
    else newReports[index].videos = arr;
    setReports(newReports);
  };

  const handleDescriptionChange = (index, text) => {
    const newReports = [...reports];
    newReports[index].description = text;
    setReports(newReports);
  };

  const handleExtraInputChange = (index, value) => {
    const newReports = [...reports];
    newReports[index].extraInput = value;
    setReports(newReports);
  };

  const handleAI = (index) => {
    const hasPhotos = reports[index].photos && reports[index].photos.length > 0;
    if (!hasPhotos) { alert("Photos are mandatory for AI check."); return; }
    if (reports[index].aiChecked) return;

    setAiLoading((prev) => { const copy = [...prev]; copy[index] = true; return copy; });
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setReports((prev) => { const copy = [...prev]; copy[index].aiChecked = true; return copy; });
        setAiLoading((prev) => { const copy = [...prev]; copy[index] = false; return copy; });
      }
      setAiProgress((prev) => { const copy = [...prev]; copy[index] = progress; return copy; });
    }, 300);
  };

  const handleSubmit = async (index) => {
  if (!userEmail || !userName || !contactInfo) {
    alert("Please ensure your email, name and contact info are set in localStorage.");
    return;
  }
  if (!reports[index].description.trim()) { alert("Please write your report."); return; }
  if (!reports[index].aiChecked) { alert("Check AI content before submitting."); return; }
  if (reports[index].submitted) { alert("This report is already submitted."); return; }

  if (index === 0 && (!totalFunds || isNaN(totalFunds))) {
    alert("Please enter a valid number for Total Funds Allocated.");
    return;
  }
  if (index !== 0 && (!reports[index].extraInput || isNaN(reports[index].extraInput))) {
    alert("Please enter a valid number for Funds Spent.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("userEmail", userEmail);
    formData.append("userName", userName);
    formData.append("contactInfo", contactInfo);
    formData.append("villageID", villageID);
    formData.append("villageName", villagedata.village.name);
    formData.append("district", villagedata.village.district);
    formData.append("state", villagedata.village.state);
    formData.append("title", reports[index].title || `Report ${index + 1}`);
    formData.append("description", reports[index].description);

    // ✅ Send total funds or funds spent
    if (index === 0) formData.append("totalFundsAllocated", totalFunds);
    if (index !== 0) formData.append("extraInput", reports[index].extraInput);

    // ✅ Add assigned date (from tasks page)
    if (villagedata?.assignedOn) {
      formData.append("assignedON", villagedata.assignedOn);
    }

    // ✅ If final completion report, add completed date (real-time)
    if (index === reports.length - 1) {
      formData.append("completedON", new Date().toISOString());
    }

    // ✅ Attach photos/videos
    const attachFiles = (arr, fieldName) => {
      if (!arr || arr.length === 0) return;
      arr.forEach((item) => { if (item instanceof File) formData.append(fieldName, item); });
    };
    attachFiles(reports[index].photos, "photos");
    attachFiles(reports[index].videos, "videos");

    const res = await fetch(`${API_BASE}/submit/${villageID}/${index}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) { alert(data?.message || "Failed to submit report."); return; }

    const progress = data.progress || data;
    if (progress && progress.reports) {
      const updated = progress.reports.map((r, i) => ({
        title: r.title || `Report ${i + 1}`,
        description: r.description || "",
        photos: Array.isArray(r.photos)
          ? r.photos.map(p => p.startsWith("/uploads") ? `http://localhost:5000${p}` : p)
          : [],
        videos: Array.isArray(r.videos)
          ? r.videos.map(v => v.startsWith("/uploads") ? `http://localhost:5000${v}` : v)
          : [],
        aiChecked: !!r.aiChecked,
        submitted: !!r.submitted,
        extraInput: r.extraInput || "",
      }));
      setReports(updated);
      if (progress.totalFundsAllocated) setTotalFunds(progress.totalFundsAllocated);
    }

    alert(`${reports[index].title} submitted successfully!`);

  } catch (err) {
    console.error("Submit error:", err);
    alert("Server error while submitting report.");
  }
};


  const renderPhotoThumbs = (photos) => {
    if (!photos || photos.length === 0) return <p className="text-sm text-gray-500">No photos</p>;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {photos.map((p, i) => {
          const src = p instanceof File ? URL.createObjectURL(p) : `http://localhost:5000${p}`;
          return <img key={i} src={src} alt={`photo-${i}`} className="w-full h-36 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-200" />;
        })}
      </div>
    );
  };

  const renderVideoPreviews = (videos) => {
    if (!videos || videos.length === 0) return <p className="text-sm text-gray-500">No videos</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {videos.map((v, i) => {
          const src = v instanceof File ? URL.createObjectURL(v) : `http://localhost:5000${v}`;
          return (
            <video key={i} controls className="w-full h-48 rounded-xl shadow-md">
              <source src={src} />
              Your browser does not support the video tag.
            </video>
          );
        })}
      </div>
    );
  };

  if (!villagedata) return <p className="text-center text-xl text-gray-700 mt-20 animate-pulse">Loading village details...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pb-20">
      <Navbar />
      <div className="pt-24 flex flex-col items-center space-y-10 px-4 md:px-0">
        {/* Village Card */}
        <div className="bg-gradient-to-r from-teal-200 to-cyan-100 shadow-xl rounded-3xl p-6 md:p-8 w-full md:w-[80vw] border-l-8 border-cyan-500">
          <h2 className="text-3xl font-bold text-cyan-800 mb-2 md:mb-3">{villagedata.village.name}, {villagedata.village.district}, {villagedata.village.state}</h2>
          <p className="text-gray-700 font-medium">🆔 Village ID: {villagedata.village.villageID}</p>
        </div>

        {(!userEmail || !userName || !contactInfo) && (
          <div className="bg-red-100 border-l-4 border-red-500 rounded-xl p-4 w-full md:w-[80vw] text-red-700 font-medium shadow-inner">
            Heads up: profile info not found. Set <code>email</code>, <code>name</code>, <code>contactInfo</code> in localStorage.
          </div>
        )}

        {reports.map((report, index) => (
          <div key={index} className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full md:w-[80vw] border-l-8 ${report.submitted ? "border-green-500" : "border-indigo-500"}`}>
            {report.submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">{report.title}</h3>
                <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg">✅ Submitted</div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-indigo-700 mb-5">{report.title}</h3>

                {index === 0 && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">💰 Total Funds Allocated</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-100 cursor-not-allowed"
                      value={totalFunds}
                      readOnly
                      placeholder="Total funds allocated (auto-filled)"
                    />
                  </div>
                )}

                <textarea
                  className="w-full border border-gray-300 rounded-2xl p-4 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
                  rows="3"
                  placeholder="Write your report details here..."
                  value={report.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  disabled={index > 0 && reports[index - 1] && !reports[index - 1].submitted}
                />

                {index !== 0 && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">💸 Funds Spent</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={report.extraInput || ""}
                      onChange={(e) => handleExtraInputChange(index, e.target.value)}
                      placeholder="Enter funds spent"
                      disabled={index > 0 && reports[index - 1] && !reports[index - 1].submitted}
                      required
                    />
                  </div>
                )}

                <div className="relative mb-4">
                  <label className="text-gray-700 font-medium mb-1 block">📸 Upload Photos (mandatory)</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={(e) => handleFileChange(index, e.target.files, "photo")}
                    disabled={index > 0 && reports[index - 1] && !reports[index - 1].submitted}
                    className="border border-gray-300 rounded-2xl p-3 w-full pr-32"
                    ref={(el) => (photoRefs.current[index] = el)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2/3 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-2xl font-semibold shadow-md"
                    onClick={() => photoRefs.current[index]?.click()}
                  >
                    +
                  </button>
                  {reports[index].photos && reports[index].photos.length > 0 && <div className="mt-3">{renderPhotoThumbs(reports[index].photos)}</div>}
                </div>

                <div className="relative mb-4">
                  <label className="text-gray-700 font-medium mb-1 block">🎥 Upload Videos (optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    capture="camcorder"
                    multiple
                    onChange={(e) => handleFileChange(index, e.target.files, "video")}
                    disabled={index > 0 && reports[index - 1] && !reports[index - 1].submitted}
                    className="border border-gray-300 rounded-2xl p-3 w-full pr-32"
                    ref={(el) => (videoRefs.current[index] = el)}
                  />
                  <button
                    className="absolute right-2 top-2/3 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-2xl font-semibold shadow-md"
                    onClick={() => videoRefs.current[index]?.click()}
                  >
                    +
                  </button>
                  {reports[index].videos && reports[index].videos.length > 0 && <div className="mt-3">{renderVideoPreviews(reports[index].videos)}</div>}
                </div>

                <div className="flex flex-col items-center mb-4">
                  <button
                    className={`py-2 px-6 rounded-2xl font-semibold shadow-md text-white ${report.aiChecked ? "bg-green-500 cursor-default" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    onClick={() => handleAI(index)}
                    disabled={report.aiChecked || (index > 0 && reports[index - 1] && !reports[index - 1].submitted)}
                  >
                    {report.aiChecked ? "✅ AI Check Passed" : aiLoading[index] ? `⏳ AI Checking ${aiProgress[index]}%` : "🔍 Check AI Content"}
                  </button>
                  {aiLoading[index] && (
                    <div className="w-full bg-gray-200 rounded-full mt-2 h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${aiProgress[index]}%` }}></div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    className={`py-3 px-6 rounded-2xl font-semibold shadow-md text-white ${report.aiChecked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed text-gray-700"}`}
                    onClick={() => handleSubmit(index)}
                    disabled={!report.aiChecked}
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateProgress;
