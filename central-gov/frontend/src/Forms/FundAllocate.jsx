import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { allocateFunds } from "../features/fund/fundSlice";
import { getAllSchemes } from "../features/scheme/schemeSlice";

export default function FundAllocate({  }) {
  const dispatch = useDispatch();
  const { status, message, error } = useSelector((state) => state.fund);
  const { schemes } = useSelector((state) => state.scheme);

  useEffect(() => {
    dispatch(getAllSchemes());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    schemeId: "",
    stateUT: "",
    village:"",
    allocatedAmount: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(allocateFunds(formData));
  };

  useEffect(() => {
    if (message || error) setOpen(true);
  }, [message, error]);

  useEffect(() => {
    if (status === "succeeded") {
      setFormData({ schemeId: "",
         stateUT: "",
        village:"", allocatedAmount: "" });
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 3, ml: 3, mr: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1a237e" }}>
          Allocate Funds to Schemes
        </Typography>

        <Card sx={{ mt: 2, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Scheme Select */}
              <TextField
                fullWidth
                select
                label="Select Scheme"
                name="schemeId"
                value={formData.schemeId}
                onChange={handleChange}
                margin="normal"
                required
              >
                {schemes.map((scheme) => (
                  <MenuItem key={scheme._id} value={scheme._id}>
                    {scheme.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* State/UT Select */}
              <TextField
                fullWidth
                select
                label="Select State/UT"
                name="stateUT"
                value={formData.stateUT}
                onChange={handleChange}
                margin="normal"
                required
              >
                {schemes.map((scheme) => (
                  <MenuItem key={scheme._id} value={scheme._id}>
                    {scheme.stateUT}
                  </MenuItem>
                ))}
              </TextField>

              {/* Villages/Cities Select*/}

             <TextField
  fullWidth
  select
  label="Select Village/City"
  name="village"
  value={formData.village} // use village, not state
  onChange={handleChange}
  margin="normal"
  required
>
  {schemes.map((scheme) => (
    <MenuItem key={scheme._id} value={scheme.village}>
      {scheme.village}
    </MenuItem>
  ))}
</TextField>


            

              {/* Allocated Amount */}
              <TextField
                fullWidth
                label="Allocated Amount (in ₹ Cr)"
                name="allocatedAmount"
                value={formData.allocatedAmount}
                onChange={handleChange}
                margin="normal"
                type="number"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Allocating..." : "Allocate Funds"}
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

// schemesList=[],
//  statesList=[]