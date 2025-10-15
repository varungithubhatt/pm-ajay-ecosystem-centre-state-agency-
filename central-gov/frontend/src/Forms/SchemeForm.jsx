import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { createScheme } from "../features/scheme/schemeSlice";

export default function SchemeForm() {
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.scheme);

  const [formData, setFormData] = useState({
    name: "",
    stateUT: "",
    village: "",
    description: "",
    category: "",
    launchDate: "",
    guidelines: "",
    eligibilityCriteria: "",
    deadline: "",
  });

  const [open, setOpen] = useState(false);

  const categories = ["Adarsh Gram", "GIA", "Hostel", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createScheme(formData));
  };

  useEffect(() => {
    if (message || error) setOpen(true);
  }, [message, error]);

  useEffect(() => {
    if (status === "succeeded") {
      setFormData({
        name: "",
        stateUT: "",
        village: "",
        description: "",
        category: "",
        launchDate: "",
        guidelines: "",
        eligibilityCriteria: "",
        deadline: "",
      });
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 3, ml: 3, mr: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1a237e" }}>
          Create New Scheme
        </Typography>

        <Card sx={{ mt: 2, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Scheme Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="State/UT" name="stateUT" value={formData.stateUT} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Village/City" name="village" value={formData.village} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={3} required />
              <TextField fullWidth select label="Category" name="category" value={formData.category} onChange={handleChange} margin="normal" required>
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Launch Date" name="launchDate" type="date" value={formData.launchDate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Guidelines" name="guidelines" value={formData.guidelines} onChange={handleChange} margin="normal" multiline rows={2} />
              <TextField fullWidth label="Eligibility Criteria" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} margin="normal" multiline rows={2} />
              <TextField fullWidth label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={status === "loading"}>
                {status === "loading" ? "Submitting..." : "Create Scheme"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          message={message || error}
          ContentProps={{ sx: { backgroundColor: error ? "red" : "#1976d2", color: "#fff" } }}
        />
      </Box>
    </>
  );
}
