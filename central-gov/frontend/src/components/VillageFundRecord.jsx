import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import Navbar from "./Navbar";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center",
};

export default function VillageFundRecord() {
  const [fundAllocations, setFundAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [newFunds, setNewFunds] = useState("");
  const [fundLoading, setFundLoading] = useState(false);
  const [fundError, setFundError] = useState(null);

  const [expandedStates, setExpandedStates] = useState({}); // track which states are expanded

  // Fetch all village funds from backend
  const fetchAllFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:7000/village-funds");
      if (!response.ok) throw new Error("Failed to fetch village funds");
      const data = await response.json();
      setFundAllocations(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFunds();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleOpenModal = (village) => {
    setSelectedVillage(village);
    setNewFunds(village.fundsAllocated);
    setFundError(null);
    setOpenModal(true);
  };

  const handleUpdateFunds = async () => {
    if (!newFunds || isNaN(newFunds) || newFunds <= 0) {
      setFundError("Enter a valid amount");
      return;
    }

    setFundLoading(true);
    setFundError(null);

    try {
      const response = await fetch(
        `http://localhost:7000/village-funds/${selectedVillage.villageID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fundsAllocated: Number(newFunds) }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        setFundError(errData.message || "Failed to update funds");
        setFundLoading(false);
        return;
      }

      // Refresh data
      await fetchAllFunds();
      setOpenModal(false);
      setOpenSnackbar(true);
    } catch (err) {
      setFundError("Failed to update funds");
    } finally {
      setFundLoading(false);
    }
  };

  const toggleState = (state) => {
    setExpandedStates((prev) => ({ ...prev, [state]: !prev[state] }));
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ mt: 3, textAlign: "center" }}>
        {error}
      </Typography>
    );

  if (!fundAllocations.length)
    return (
      <Typography sx={{ mt: 3, textAlign: "center" }}>
        No fund allocation records found.
      </Typography>
    );

  // get unique states
  const states = [...new Set(fundAllocations.map((v) => v.state))];

  return (
    <>
      <Navbar />
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Village Fund Allocations
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
            fundAllocations
              .filter((v) => v.state === state)
              .map((record) => (
                <Card key={record.villageID} sx={{ borderRadius: 2, boxShadow: 3, mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                      {record.villageName} ({record.villageID})
                    </Typography>
                    <Typography>
                      <strong>District:</strong> {record.district}
                    </Typography>
                    <Typography>
                      <strong>Funds Allocated:</strong> ₹{record.fundsAllocated.toLocaleString()}
                    </Typography>
                    <Typography>
                      <strong>Assigned At:</strong>{" "}
                      {new Date(record.createdAt).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenModal(record)}
                    >
                      Update Funds
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </Box>
      ))}

      {/* Update Funds Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Update Funds for {selectedVillage?.villageName}
          </Typography>
          <TextField
            fullWidth
            label="New Amount (₹)"
            type="number"
            value={newFunds}
            onChange={(e) => setNewFunds(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdateFunds}
            disabled={fundLoading}
          >
            {fundLoading ? "Updating..." : "Update"}
          </Button>
          {fundError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {fundError}
            </Alert>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Fund allocation updated successfully!
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
}
