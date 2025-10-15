import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFundAllocations } from "../features/fund/fundSlice";

import Navbar from "./Navbar";
import { Box, Typography, Card, CardContent} from "@mui/material";

export default function FundRecord() {
  const dispatch = useDispatch();
  const { allocations, status, error } = useSelector((state) => state.fund);
 



  const totalAllocated = allocations.reduce(
    (sum, alloc) => sum + (alloc.allocatedAmount || 0),
    0
  );

  useEffect(() => {
    dispatch(getFundAllocations());
   
  }, [dispatch]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Loading fund allocations...
        </p>
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        <Navbar />
        <p
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "red",
          }}
        >
          Error: {error}
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "30px",
          background: "#f9fafb",
          borderRadius: "12px",
          margin: "30px auto",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#1e3a8a" }}>
          Fund Allocations
        </Typography>

        {allocations.length === 0 ? (
          <Typography>No fund allocations available.</Typography>
        ) : (
          allocations.map((alloc) => (
            <Card
              key={alloc._id}
              sx={{
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ color: "#2563eb" }}>
                {alloc.scheme?.name} ({alloc.scheme?.category})
              </Typography>
              <Typography variant="body2">
                <strong>State/UT:</strong> {alloc.stateUT}
              </Typography>
              <Typography variant="body2">
                <strong>Allocated Amount:</strong> ₹ {alloc.allocatedAmount}
              </Typography>
              <Typography variant="body2">
                <strong>Released Amount:</strong> ₹ {alloc.releasedAmount}
              </Typography>
              <Typography variant="body2">
                <strong>Utilization Status:</strong> {alloc.utilizationStatus}
              </Typography>
              {alloc.deadline && (
                <Typography variant="body2">
                  <strong>Deadline:</strong>{" "}
                  {new Date(alloc.deadline).toLocaleDateString()}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Created by: {alloc.createdBy?.name} ({alloc.createdBy?.email})
              </Typography>
            </Card>
          ))
        )}
      </Box>

     <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",  // full viewport height
      
      }}
    >
      <Card sx={{ width: 300, p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#065f46" }}>
            Total Fund Allocated
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#065f46" }}>
            ₹ {totalAllocated.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Total fund sanctioned across all schemes
          </Typography>
        </CardContent>
      </Card>
    </Box>
    </>
  );
}
