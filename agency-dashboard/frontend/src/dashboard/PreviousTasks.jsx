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

function PreviousTaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetch(`http://localhost:5000/api/previous-tasks/user/${email}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) setTasks(resData.data);
        else setTasks([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching previous tasks:", err);
        setTasks([]);
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress sx={{ color: "#ff5b9f" }} />
        <Typography sx={{ color: "#f64f59", mt: 2 }}>
          Loading previous tasks...
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #ffffff, #ffdde1)",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Box sx={{ p: 3, mt: 12 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#ff5b9f",
            textAlign: "center",
          }}
        >
          🏛️ Previous Completed Tasks
        </Typography>

        {tasks.map((task) => (
          <Card
            key={task._id}
            sx={{
              maxWidth: 1200,
              margin: "auto",
              background: "linear-gradient(145deg, #ffffff, #ffdde1)",
              boxShadow: 5,
              borderRadius: 4,
              p: 3,
              mb: 5,
              borderLeft: "6px solid #ff5b9f",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "scale(1.02)", boxShadow: 10 },
            }}
          >
            <CardContent>
              {/* Village Info */}
              <Typography
                variant="h5"
                sx={{ color: "#ff5b9f", fontWeight: "bold", mb: 1 }}
              >
                {task.villageName} ({task.state})
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "#f64f59", mb: 2 }}
              >
                District: {task.district} | Village ID: {task.villageID}
              </Typography>

              {/* Total Funds */}
              <Typography
                variant="h6"
                sx={{ color: "#ff5b9f", fontWeight: "bold", mb: 2 }}
              >
                💰 Total Funds Allocated: ₹{task.totalFundsAllocated || 0}
              </Typography>

              {/* Overall Dates */}
              <Typography sx={{ color: "#f64f59", mb: 1 }}>
                🗓️ <b>Assigned On:</b>{" "}
                {new Date(task.assignedON).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "#f64f59", mb: 2 }}>
                ✅ <b>Completed On:</b>{" "}
                {task.completedON
                  ? new Date(task.completedON).toLocaleDateString()
                  : "Not Available"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* User Info */}
              <Typography sx={{ color: "#f64f59", mb: 1 }}>
                <b>Submitted by:</b> {task.userName}
              </Typography>
              <Typography sx={{ color: "#f64f59" }}>
                <b>Email:</b> {task.userEmail}
              </Typography>
              <Typography sx={{ color: "#f64f59", mb: 2 }}>
                <b>Contact:</b> {task.contactInfo}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Reports Section */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ff5b9f",
                  mb: 3,
                  textDecoration: "underline",
                }}
              >
                Reports:
              </Typography>

              {task.reports.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    background: "#ffffff",
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    boxShadow: 2,
                    transition: "background 0.2s ease",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#ff5b9f",
                      mb: 1,
                    }}
                  >
                    {r.title || `Report ${i + 1}`}
                  </Typography>

                  <Typography sx={{ color: "#f64f59", mb: 1, whiteSpace: "pre-line" }}>
                    {r.description || "No description provided."}
                  </Typography>

                  {i !== 0 && (
                    <Typography sx={{ color: "#ff6ea4", mb: 1 }}>
                      💸 Funds Spent: ₹{r.fundsSpent || 0}
                    </Typography>
                  )}

                  {/* Photos */}
                  {r.photos && r.photos.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#ff6ea4", fontWeight: "bold", mb: 1 }}
                      >
                        📸 Photos:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
                                width: "150px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                border: "2px solid #ff6ea4",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                transition: "transform 0.2s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
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
                        sx={{ color: "#ff6ea4", fontWeight: "bold", mb: 1 }}
                      >
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
                              border: "2px solid #ff6ea4",
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
    </div>
  );
}

export default PreviousTaskDashboard;
