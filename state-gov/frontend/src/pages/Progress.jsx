import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProgressDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateName, setStateName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("pmAjayUser"));
    if (user && user.stateName) {
      setStateName(user.stateName);
      fetchReports(user.stateName);
    } else {
      setReports([]);
      setLoading(false);
    }
  }, []);

  const fetchReports = async (state) => {
    try {
      const res = await fetch(`http://localhost:4000/api/progress/state/${encodeURIComponent(state)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch reports");

      // Only show submitted reports
      const submittedReports = data.data.filter((report) =>
        report.reports.some((r) => r.submitted)
      );
      setReports(submittedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress sx={{ color: "#757575" }} />
        <Typography sx={{ color: "#757575", mt: 2 }}>Loading reports...</Typography>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", paddingBottom: "50px" }}>
      <Box sx={{ p: 3, mt: 5 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#424242",
            textAlign: "center",
          }}
        >
          🏛️ Progress Reports of Agencies in {stateName}
        </Typography>

        {reports.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 5 }}>
            No submitted reports found for this state.
          </Typography>
        ) : (
          reports.map((reportData) => (
            <Card
              key={reportData._id}
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow: 2,
                borderRadius: 2,
                p: 2,
                mb: 4,
              }}
            >
              <CardContent>
                {/* Village Info */}
                <Typography
                  variant="h5"
                  sx={{ color: "#212121", fontWeight: "bold", mb: 1 }}
                >
                  {reportData.villageName} ({reportData.state})
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#616161", mb: 2 }}>
                  District: {reportData.district} | Village ID: {reportData.villageID}
                </Typography>

                {/* Total Funds Allocated */}
                <Typography
                  variant="h6"
                  sx={{ color: "#424242", fontWeight: "bold", mb: 2 }}
                >
                  💰 Total Funds Allocated: ₹{reportData.totalFundsAllocated || 0}
                </Typography>

                <Divider sx={{ my: 2, borderColor: "#E0E0E0" }} />

                {/* User Info */}
                <Typography sx={{ color: "#424242", mb: 1 }}>
                  <b>Submitted by:</b> {reportData.userName}
                </Typography>
                <Typography sx={{ color: "#424242" }}>
                  <b>Email:</b> {reportData.userEmail}
                </Typography>
                <Typography sx={{ color: "#424242", mb: 2 }}>
                  <b>Contact:</b> {reportData.contactInfo}
                </Typography>

                <Divider sx={{ mb: 2, borderColor: "#E0E0E0" }} />

                {/* Reports Section */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#424242",
                    mb: 2,
                    textDecoration: "underline",
                  }}
                >
                  Reports:
                </Typography>

                {reportData.reports
                  .filter((r) => r.submitted) // only show submitted reports
                  .map((r, i) => (
                    <Box
                      key={i}
                      sx={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                        boxShadow: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: "#212121",
                        }}
                      >
                        {r.title || `Report ${i + 1}`}
                      </Typography>

                      <Typography
                        sx={{ color: "#424242", mb: 1, whiteSpace: "pre-line" }}
                      >
                        {r.description || "No description provided."}
                      </Typography>

                      {/* Funds Spent */}
                      <Typography sx={{ color: "#616161", mb: 1 }}>
                        💸 Funds Spent: ₹{r.fundsSpent || 0}
                      </Typography>

                      {/* Photos */}
                      {r.photos && r.photos.length > 0 && (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#424242", fontWeight: "bold", mb: 1 }}
                          >
                            📸 Photos:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                            {r.photos.map((photo, idx) => (
                              <a
                                key={idx}
                                href={`http://localhost:5000${photo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={`http://localhost:5000${photo}`}
                                  alt="Report"
                                  style={{
                                    width: "200px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    border: "2px solid #E0E0E0",
                                  }}
                                />
                              </a>
                            ))}
                          </Box>
                        </>
                      )}

                      {/* Videos */}
                      {r.videos && r.videos.length > 0 && (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#424242", fontWeight: "bold", mb: 1 }}
                          >
                            🎥 Videos:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {r.videos.map((video, idx) => (
                              <video
                                key={idx}
                                src={`http://localhost:5000${video}`}
                                width="240"
                                height="140"
                                controls
                                style={{
                                  borderRadius: "12px",
                                  border: "2px solid #E0E0E0",
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      )}

                      <Typography sx={{ mt: 2, color: r.aiChecked ? "green" : "red" }}>
                        ✅ AI Checked: {r.aiChecked ? "Yes" : "No"}
                      </Typography>
                      <Typography sx={{ color: "green" }}>
                        📤 Submitted: Yes
                      </Typography>
                    </Box>
                  ))}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </div>
  );
}

export default ProgressDashboard;
