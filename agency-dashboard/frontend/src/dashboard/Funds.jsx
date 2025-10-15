import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import Navbar from "./Navbar";

function FundsPage() {
  const [fundsData, setFundsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [combinedRemaining, setCombinedRemaining] = useState(0);

  useEffect(() => {
    const fetchFundsData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) throw new Error("No logged-in email found");

        const tasksRes = await fetch(`http://localhost:5000/api/tasks?email=${email}`);
        const tasks = await tasksRes.json();

        const results = await Promise.all(
          tasks.map(async (task) => {
            const villageID = task.village.villageID;

            let totalFunds = 0;
            try {
              const fundsRes = await fetch(`http://localhost:5000/api/village-funds?villageID=${villageID}`);
              const fundsData = await fundsRes.json();
              totalFunds = fundsData?.fundsAllocated || 0;
            } catch (err) {
              console.error(`Error fetching funds for village ${villageID}:`, err);
            }

            let reports = [];
            try {
              const progressRes = await fetch(`http://localhost:5000/api/progress/user/${email}`);
              const progressData = await progressRes.json();
              if (progressData?.data && progressData.data.length > 0) {
                const villageProgress = progressData.data.find((v) => v.villageID === String(villageID));
                if (villageProgress && villageProgress.reports) {
                  reports = villageProgress.reports.filter((r) => r.submitted);
                }
              }
            } catch (err) {
              console.error(`Error fetching progress reports for village ${villageID}:`, err);
            }

            const fundsSpent = reports
              .filter((r, i) => i !== 0)
              .reduce((sum, r) => sum + (r.fundsSpent || 0), 0);

            const remainingFunds = totalFunds - fundsSpent;

            return {
              villageName: task.village.name,
              district: task.village.district,
              state: task.village.state,
              totalFunds,
              reports,
              fundsSpent,
              remainingFunds,
            };
          })
        );

        const total = results.reduce((sum, v) => sum + v.totalFunds, 0);
        const remaining = results.reduce((sum, v) => sum + v.remainingFunds, 0);

        setFundsData(results);
        setCombinedTotal(total);
        setCombinedRemaining(remaining);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching funds page data:", err);
        setLoading(false);
      }
    };

    fetchFundsData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress sx={{ color: "#43A047" }} />
        <Typography sx={{ color: "#2E7D32", mt: 2 }}>Loading funds data...</Typography>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(to bottom, #FFFFFF, #E8F5E9)", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 3, mt: 10 }}>
        {/* Combined Funds */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2E7D32" }}>
            💰 Village Funds Overview
          </Typography>
          <Typography variant="h6" sx={{ color: "#388E3C", mt: 1 }}>
            Total Combined Funds: ₹{combinedTotal.toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ color: "#43A047", mt: 0.5 }}>
            Remaining Combined Funds: ₹{combinedRemaining.toLocaleString()}
          </Typography>
        </Box>

        {/* Village Cards */}
        {
        fundsData.map((village, idx) =>(
  <Card
    key={idx}
    sx={{
      maxWidth: 900,              // limit card width
      margin: "auto",             // center card horizontally
      background: "linear-gradient(145deg, #F1F8E9, #E8F5E9)",
      boxShadow: 4,
      borderRadius: 3,
      p: 3,
      mb: 4,
      borderLeft: "6px solid #66BB6A",
      transition: "transform 0.2s ease, boxShadow 0.2s ease",
      "&:hover": { transform: "scale(1.02)", boxShadow: 8 },
    }}
  >
    <CardContent>
      <Typography variant="h5" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
        {village.villageName}, {village.district}, {village.state}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#388E3C", mb: 2 }}>
        🏦 Total Funds Allocated: ₹{village.totalFunds.toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {village.reports.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: "bold", color: "#2E7D32", mb: 1 }}>
            Reports Submitted:
          </Typography>
          {village.reports.map((r, i) => (
            <Box key={i} sx={{ mb: 1, pl: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "#43A047" }}>
                {r.title || `Report ${i + 1}`}
                {i !== 0 && ` - Funds Spent: ₹${(r.fundsSpent || 0).toLocaleString()}`}
              </Typography>
            </Box>
          ))}
        </>
      ) : (
        <Typography sx={{ color: "#1B5E20", fontStyle: "italic", mb: 1 }}>
          No reports submitted yet.
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography sx={{ fontWeight: "bold", color: "#2E7D32" }}>
        Remaining Funds: ₹{village.remainingFunds.toLocaleString()}
      </Typography>
    </CardContent>
  </Card>
))}
      </Box>
    </div>
  );
}

export default FundsPage;
