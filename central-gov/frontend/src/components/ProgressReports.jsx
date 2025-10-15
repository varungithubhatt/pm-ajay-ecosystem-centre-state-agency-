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

export default function ProgressReports() {
  const [progressReports, setProgressReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    fetch("http://localhost:7000/api/progress")
      .then((res) => res.json())
      .then((data) => {
        const reportsArray = Array.isArray(data) ? data : data.data || [];
        const submittedReports = reportsArray.map((report) => ({
          ...report,
          reports: report.reports.filter((r) => r.submitted),
        }));
        setProgressReports(submittedReports);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching progress reports:", err);
        setLoading(false);
      });
  }, []);

  const toggleState = (state) => {
    setExpandedStates((prev) => ({ ...prev, [state]: !prev[state] }));
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!progressReports.length)
    return (
      <Typography sx={{ mt: 3, textAlign: "center" }}>
        No progress reports found.
      </Typography>
    );

  const states = [...new Set(progressReports.map((v) => v.state))];

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          Progress Reports
        </Typography>

        {states.map((state) => (
          <Box key={state} sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                color: "#1a237e",
                mb: 1,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => toggleState(state)}
            >
              {state}
            </Typography>

            {expandedStates[state] &&
              progressReports
                .filter((village) => village.state === state)
                .map((village, index) => (
                  <Card
                    key={index}
                    sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                        {village.villageName}, {village.district}, {village.state}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", mb: 1 }}>
                        <strong>Village ID:</strong> {village.villageID}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>Submitted By:</strong> {village.userName} ({village.userEmail})
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>Contact:</strong> {village.contactInfo}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>Submitted On:</strong> {new Date(village.createdAt).toLocaleString()}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Total Funds Allocated:</strong> ₹{village.totalFundsAllocated.toLocaleString()}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {village.reports.map((report, rIndex) => (
                        <Box
                          key={rIndex}
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f9f9f9",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            {report.title}
                          </Typography>
                          <Typography sx={{ mb: 1 }}>{report.description}</Typography>

                          {report.fundsSpent && (
                            <Typography sx={{ mb: 1 }}>
                              <strong>Funds Spent:</strong> ₹{report.fundsSpent.toLocaleString()}
                            </Typography>
                          )}

                          {/* Photos */}
                          {report.photos && report.photos.length > 0 && (
                            <>
                              <Typography variant="subtitle2" sx={{ color: "#D84315", fontWeight: "bold", mb: 1 }}>
                                📸 Photos:
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                                {report.photos.map((photo, idx) => (
                                  <a key={idx} href={`http://localhost:5000${photo}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={`http://localhost:5000${photo}`}
                                      alt="Report"
                                      style={{
                                        width: "150px",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        border: "2px solid #94918bff",
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
                          {report.videos && report.videos.length > 0 && (
                            <>
                              <Typography variant="subtitle2" sx={{ color: "#D84315", fontWeight: "bold", mb: 1 }}>
                                🎥 Videos:
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {report.videos.map((video, idx) => (
                                  <video
                                    key={idx}
                                    src={`http://localhost:5000${video}`}
                                    width="220"
                                    height="140"
                                    controls
                                    style={{
                                      borderRadius: "12px",
                                      border: "2px solid #97938eff",
                                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                  />
                                ))}
                              </Box>
                            </>
                          )}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                ))}
          </Box>
        ))}
      </Box>
    </>
  );
}
