import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OverviewPage() {
  const [fundAllocations, setFundAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/api/villages");
        setFundAllocations(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching fund allocations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignNGO = (villageID) => {
    navigate("/ngos", { state: { villageID } });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#FAF9F6",
        }}
      >
        <CircularProgress size={60} thickness={5} sx={{ color: "#7B1FA2" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FAF9F6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography
          color="error"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!fundAllocations || fundAllocations.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FAF9F6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontStyle: "italic",
            color: "#757575",
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          No fund allocation records found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FAF9F6",
        py: 5,
        px: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          
          fontWeight: "bold",
          mb: 4,
          textAlign: "center",
          color: "#4A148C",
          textTransform: "uppercase",
          letterSpacing: 3,
          borderBottom: "4px solid #7B1FA2",
          pb: 1.5,
          fontFamily: "'Roboto Slab', serif",
          userSelect: "none",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        Village & Fund Allocations
      </Typography>

      <Grid container spacing={4} justifyContent="center" maxWidth={1200} mx="auto">
        {fundAllocations.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={`${record.villageID}-${record.allocatedAt}`}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(123, 31, 162, 0.15)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 10px 20px rgba(123, 31, 162, 0.3)",
                },
                backgroundColor: "#FFFFFF",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "#6A1B9A" }}
                >
                  {record.villageName} ({record.villageID})
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  <strong>District:</strong> {record.district}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  <strong>State:</strong> {record.state}
                </Typography>
                <Typography sx={{ mb: 0.5, color: "#BF360C", fontWeight: "bold" }}>
                  <strong>Amount:</strong> ₹{record.amount.toLocaleString()}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  <strong>Allocated By:</strong> {record.allocatedBy}
                </Typography>
                <Typography
                  sx={{ mb: 2, fontStyle: "italic", fontSize: "0.9rem", color: "#555" }}
                >
                  <strong>Allocated At:</strong>{" "}
                  {new Date(record.allocatedAt).toLocaleString()}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAssignNGO(record.villageID)}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#7B1FA2",
                    "&:hover": { backgroundColor: "#4A148C" },
                  }}
                >
                  Assign NGO's
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Fund allocation successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}
