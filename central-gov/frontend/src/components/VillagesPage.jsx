import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVillages } from "../features/village/villageSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";

export default function VillagesPage() {
  const dispatch = useDispatch();
  const { villages, loading, error } = useSelector((state) => state.village);

  const [expandedStates, setExpandedStates] = useState([]);

  useEffect(() => {
    dispatch(getVillages());
  }, [dispatch]);

  // Extract unique states/UTs from the villages
  const states = [...new Set(villages.map((v) => v.state))];

  const handleStateClick = (state) => {
    if (expandedStates.includes(state)) {
      setExpandedStates(expandedStates.filter((s) => s !== state));
    } else {
      setExpandedStates([...expandedStates, state]);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1a237e",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
           Villages as per States Eligible for PM-AJAY scheme
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 3 }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {states.map((state) => {
              const villagesInState = villages.filter((v) => v.state === state);
              const isExpanded = expandedStates.includes(state);

              return (
                <Box key={state}>
                  {/* State Button */}
                  <Button
                    fullWidth
                    variant={isExpanded ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleStateClick(state)}
                    sx={{ justifyContent: "flex-start",color: "#1a237e" }}
                  >
                    {state}
                  </Button>

                  {/* Collapsible list of villages */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        color: "#1a237e",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 1,
                        pl: 2, // indent for clarity
                      }}
                    >
                      {villagesInState.map((village) => (
                        <Card
                          key={village._id}
                          component={Link}
                          to={`/villages/${village._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                          sx={{
                            color: "#1a237e",
                            width: 300,
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: 2,
                            transition: "transform 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {village.villageName}
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                              District: {village.district}
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                              State: {village.state}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
