import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVillageById, clearSelectedVillage } from "../features/village/villageSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Modal,
  TextField,
  Alert,
  Snackbar
} from "@mui/material";
import Navbar from "./Navbar";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];
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

export default function VillageDetailsPage() {
  const navigate=useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedVillage: village, loading, error } = useSelector((state) => state.village);

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [villageFunds, setVillageFunds] = useState(null);
  const [fundError, setFundError] = useState(null);
  const [fundLoading, setFundLoading] = useState(false);
  const [fundFetchLoading, setFundFetchLoading] = useState(false);

  // Fetch village data
  useEffect(() => {
    dispatch(getVillageById(id));
    return () => dispatch(clearSelectedVillage());
  }, [dispatch, id]);

  // Fetch existing fund allocation
  useEffect(() => {
    if (!village?.villageID) return;
    let cancelled = false;
    const fetchVillageFunds = async () => {
      setFundFetchLoading(true);
      try {
  const response = await fetch(`http://localhost:7000/village-funds/${village.villageID}`);
        if (!response.ok) {
          setVillageFunds(null);
          setAmount("");
        } else {
          const data = await response.json();
          if (data.data) {
            if (!cancelled) {
              setVillageFunds(data.data);
              setAmount(data.data.fundsAllocated);
            }
          } else {
            if (!cancelled) {
              setVillageFunds(null);
              setAmount("");
            }
          }
        }
      } catch (err) {
        if (!cancelled) setVillageFunds(null);
      } finally {
        if (!cancelled) setFundFetchLoading(false);
      }
    };
    fetchVillageFunds();
    return () => { cancelled = true; };
  }, [village?.villageID]);

  // Allocate fund
  const handleAllocateFund = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    setFundLoading(true);
    setFundError(null);

    try {
  const response = await fetch(`http://localhost:7000/village-funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villageID: village.villageID,
          villageName: village.villageName,
          district: village.district,
          state: village.state,
          fundsAllocated: Number(amount),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setFundError(errData.message || "Error allocating funds");
        setFundLoading(false);
        return;
      }

      const data = await response.json();
      setVillageFunds(data.data);
      setOpen(false);
      setOpenSnackbar(true);
      setFundLoading(false);
    } catch (err) {
      setFundError("Error allocating funds");
      setFundLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
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

  const populationData = [
    { name: "SC", value: village?.description?.scPercentage || 0 },
    { name: "ST", value: village?.description?.stPercentage || 0 },
    { name: "Non-SC/ST", value: village?.description?.nonScStPercentage || 0 },
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1a237e" }}>
          {village?.villageName} Details
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Basic Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Basic Info</Typography>
                <Typography><strong>District:</strong> {village?.district}</Typography>
                <Typography><strong>State:</strong> {village?.state}</Typography>
                <Typography><strong>villageID:</strong> {village?.villageID}</Typography>
                <Typography>
                  <strong>Location:</strong> {village?.location?.latitude}, {village?.location?.longitude}
                </Typography>
                {/* Display allocated funds in input field */}
                
              </CardContent>
            </Card>
          </Grid>

          {/* Population Chart */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Population Composition</Typography>
                <PieChart width={250} height={250}>
                  <Pie
                    data={populationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {populationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>

          {/* Development Rate */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Rate</Typography>
                <Typography variant="h3" color="#1e88e5">
                  {village?.description?.developmentRate || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Problems */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Problems</Typography>
                {village?.description?.problems
                  ? Object.entries(village.description.problems).map(([key, value]) => (
                      <Typography key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {String(value)}
                      </Typography>
                    ))
                  : <Typography>No issues reported</Typography>}
              </CardContent>
            </Card>
          </Grid>

          {/* Other Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Other Details</Typography>
                <Typography>
                  Last Selected for PMAjay:{" "}
                  {village?.description?.lastSelectedForPMAjay
                    ? new Date(village.description.lastSelectedForPMAjay).toLocaleDateString()
                    : "N/A"}
                </Typography>
                {village?.description?.otherDetails &&
                  Object.entries(village.description.otherDetails).map(([key, value]) => (
                    <Typography key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {String(value)}
                    </Typography>
                  ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Development Tasks */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Tasks</Typography>
                {village?.developmentTasks?.length > 0
                  ? village.developmentTasks.map((task) => (
                      <Typography key={task.taskID}>
                        - {task.taskName} (Priority: {task.priority})
                      </Typography>
                    ))
                  : <Typography>No tasks assigned</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Allocate Fund Button */}
        <Box sx={{ mt: 3 }}>
          {fundFetchLoading ? (
            <Button variant="contained" color="primary" disabled>
              Loading fund status...
            </Button>
          ) : villageFunds ? (
            <Button variant="contained" color="primary" disabled >
              Allocated: ₹{villageFunds.fundsAllocated}
              
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Allocate Fund
            </Button>
          )}
        </Box>

        {/* Fund Allocation Modal */}
        <Modal
          open={open && !villageFunds} // prevent modal if funds exist
          onClose={() => setOpen(false)}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Allocate Fund
            </Typography>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAllocateFund}
              disabled={fundLoading}
            >
              {fundLoading ? "Processing..." : "Submit"}
            </Button>
            {fundError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fundError}
              </Alert>
            )}
          </Box>
        </Modal>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Fund allocation successful!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
