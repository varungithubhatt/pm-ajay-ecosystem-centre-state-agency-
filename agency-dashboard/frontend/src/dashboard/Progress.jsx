 
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function ProgressDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetch(`http://localhost:5000/api/progress/user/${email}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) setReports(resData.data);
        else setReports([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setReports([]);
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress sx={{ color: "#FF8A65" }} />
        <Typography sx={{ color: "#BF360C", mt: 2 }}>Loading reports...</Typography>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(to bottom, #FFFFFF, #FFE0B2)", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 3, mt: 12 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", color: "#E65100", textAlign: "center" }}
        >
          🏛️ Village Progress Reports
        </Typography>

        {reports.map((reportData) => (
          <Card
            key={reportData._id}
            sx={{
              maxWidth: 1200,              // limit card width
              margin: "auto",             // center card horizontally
              background: "linear-gradient(145deg, #FFF3E0, #FFE0B2)",
              boxShadow: 5,
              borderRadius: 4,
              p: 3,
              mb: 5,
              borderLeft: "6px solid #FF8A65",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "scale(1.02)", boxShadow: 10 },
            }}
          >
            <CardContent>
              {/* Village Info */}
              <Typography variant="h5" sx={{ color: "#E65100", fontWeight: "bold", mb: 1 }}>
                {reportData.villageName} ({reportData.state})
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#BF360C", mb: 2 }}>
                District: {reportData.district} | Village ID: {reportData.villageID}
              </Typography>

              {/* Total Funds */}
              <Typography variant="h6" sx={{ color: "#D84315", fontWeight: "bold", mb: 2 }}>
                💰 Total Funds Allocated: ₹{reportData.totalFundsAllocated || 0}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* User Info */}
              <Typography sx={{ color: "#BF360C", mb: 1 }}>
                <b>Submitted by:</b> {reportData.userName}
              </Typography>
              <Typography sx={{ color: "#BF360C" }}>
                <b>Email:</b> {reportData.userEmail}
              </Typography>
              <Typography sx={{ color: "#BF360C", mb: 2 }}>
                <b>Contact:</b> {reportData.contactInfo}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Reports Section */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#E65100", mb: 3, textDecoration: "underline" }}
              >
                Reports:
              </Typography>

              {reportData.reports.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    background: r.submitted ? "#FFE0B2" : "#FFF3E0",
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    boxShadow: 2,
                    cursor: r.submitted ? "default" : "pointer",
                    transition: "background 0.2s ease",
                    "&:hover": r.submitted ? {} : { background: "#FFD54F" },
                  }}
                  onClick={() => {
                    if (!r.submitted) navigate(`/update-progress/${reportData.villageID}`);
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: r.submitted ? "#E65100" : "#BF360C", mb: 1 }}
                  >
                    {r.title || `Report ${i + 1}`}
                  </Typography>

                  {r.submitted ? (
                    <>
                      <Typography sx={{ color: "#BF360C", mb: 1, whiteSpace: "pre-line" }}>
                        {r.description || "No description provided."}
                      </Typography>

                      {i !== 0 && (
                        <Typography sx={{ color: "#D84315", mb: 1 }}>
                          💸 Funds Spent: ₹{r.fundsSpent || 0}
                        </Typography>
                      )}

                      {/* Photos */}
                      {r.photos && r.photos.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ color: "#D84315", fontWeight: "bold", mb: 1 }}>
                            📸 Photos:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                            {r.photos.map((photo, idx) => (
                              <a key={idx} href={`http://localhost:5000${photo}`} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={`http://localhost:5000${photo}`}
                                  alt="Report"
                                  style={{
                                    width: "150px",
                                    height: "120px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    border: "2px solid #FFCC80",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    transition: "transform 0.2s",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                              </a>
                            ))}
                          </Box>
                        </>
                      )}

                      {/* Videos */}
                      {r.videos && r.videos.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ color: "#D84315", fontWeight: "bold", mb: 1 }}>
                            🎥 Videos:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {r.videos.map((video, idx) => (
                              <video
                                key={idx}
                                src={`http://localhost:5000${video}`}
                                width="220"
                                height="140"
                                controls
                                style={{
                                  borderRadius: "12px",
                                  border: "2px solid #FFCC80",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      )}

                      <Typography sx={{ mt: 2, color: r.aiChecked ? "#4CAF50" : "#D50000", fontWeight: "bold" }}>
                        ✅ AI Checked: {r.aiChecked ? "Yes" : "No"}
                      </Typography>
                      <Typography sx={{ color: r.submitted ? "#4CAF50" : "#D50000", fontWeight: "bold" }}>
                        📤 Submitted: {r.submitted ? "Yes" : "No"}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ color: "#D50000", fontStyle: "italic", mt: 1, fontWeight: "bold" }}>
                      ⚠️ This report has not been submitted yet. Click to submit.
                    </Typography>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}

export default ProgressDashboard;
