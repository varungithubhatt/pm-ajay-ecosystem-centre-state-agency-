import React from "react";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getAllSchemes } from "../features/scheme/schemeSlice";
import Navbar from "./Navbar";
import { Card, CardContent, Typography } from "@mui/material";






export  default function SchemeRecord(){
    const dispatch=useDispatch();
    const { schemes, loading, error } = useSelector((state) => state.scheme);
   const totalSchemes=schemes.length;


      


    useEffect(() => {
        dispatch(getAllSchemes());
        
      }, [dispatch]);

       if (loading) return <p>Loading schemes...</p>;
  if (error) return <p>Error: {error}</p>;
    
    return (
        <>
         {/* <div>
      <h3>Recent Schemes</h3>
      <ul>
        {schemes.map((scheme) => (
          <li key={scheme._id}>
            <strong>{scheme.name}</strong> — {scheme.category} <br />
            Launch: {new Date(scheme.launchDate).toLocaleDateString()} <br />
            Deadline: {new Date(scheme.deadline).toLocaleDateString()} <br />
            <a href={scheme.guidelines} target="_blank" rel="noreferrer">
              Guidelines
            </a>
          </li>
        ))}
      </ul>
    </div> */
    }
    
<Navbar/>
    <div
      style={{
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxHeight: "500px",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginBottom: "16px", color: "#333" }}>All Schemes</h2>
      {schemes.length === 0 ? (
        <p>No schemes available</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              style={{
                padding: "12px",
                background: "#fff",
                borderRadius: "8px",
                borderLeft: "4px solid #4caf50",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 4px 0", color: "#1976d2" }}>
                {scheme.name}
              </h3>

              <p style={{ margin: "2px 0" }}>
                <strong>StateUT:</strong> {scheme.stateUT}
              </p>
               <p style={{ margin: "2px 0" }}>
                <strong>Village:</strong> {scheme.village}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Category:</strong> {scheme.category}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Launch:</strong>{" "}
                {new Date(scheme.launchDate).toLocaleDateString()}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Deadline:</strong>{" "}
                {new Date(scheme.deadline).toLocaleDateString()}
              </p>
              <a
                href={scheme.guidelines}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  color: "#fff",
                  background: "#1976d2",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                View Guidelines
              </a>
            </div>
          ))}
        </div>
      )}
    </div>

     <Card sx={{ width: 250, p: 2, borderRadius: 2, boxShadow: 3 ,marginTop:5}}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, color: "#1e3a8a" }}>
          Total Schemes
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {totalSchemes}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Active programs under central ministries
        </Typography>
      </CardContent>
    </Card>

        </>
    )
}