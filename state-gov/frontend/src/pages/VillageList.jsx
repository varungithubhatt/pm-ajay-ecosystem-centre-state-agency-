import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const API_BASE = "http://localhost:4000/api/villages";

function VillageList() {
    const navigate = useNavigate();
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateName, setStateName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("pmAjayUser"));
    if (user && user.stateName) {
      setStateName(user.stateName);
      fetchVillages(user.stateName);
    } else {
      console.error("State not found in localStorage");
      setLoading(false);
    }
  }, []);

  const fetchVillages = async (stateName) => {
    try {
      const response = await fetch(`${API_BASE}/${encodeURIComponent(stateName)}`);
      const data = await response.json();

      if (response.ok) {
        setVillages(data.data || []);
      } else {
        console.error("Error fetching villages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: "90%", mx: "auto", p: 2, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50" }}>
            Villages in {stateName || "your state"}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
              <CircularProgress />
            </Box>
          ) : villages.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No villages found for this state.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: "70vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Village ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Village Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>District</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {villages.map((village, index) => (
                    <TableRow 
                    key={village.villageID} 
                    hover 
                    onClick={() => navigate(`/village/${village.villageID}`)} 
                    sx={{ cursor: "pointer" }}
                    >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{village.villageID}</TableCell>
                    <TableCell>{village.villageName}</TableCell>
                    <TableCell>{village.district}</TableCell>
                    <TableCell>{village.state}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default VillageList;
