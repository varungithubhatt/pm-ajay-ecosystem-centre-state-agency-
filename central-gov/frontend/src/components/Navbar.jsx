


import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";// adjust path to your action
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const navigate=useNavigate();

  // Select user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Open/Close dropdown
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout
  const handleLogout = () => {
    dispatch(logout()); // clears user & token from Redux and storage
    setAnchorEl(null);
    navigate("/"); // redirect to login page
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
         
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "black",
                width: 30,
                height: 30,
                borderRadius: "40%",
              }}
            >
              GF
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Government Fund Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ministry Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Middle Search */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f5f5f5",
              px: 2,
              py: 0.5,
              borderRadius: "8px",
              width: "40%",
            }}
          >
            <SearchIcon sx={{ mr: 1, color: "gray" }} />
            <InputBase
              placeholder="Search schemes, states, or reports..."
              fullWidth
            />
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>

            {/* User Section */}
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={handleMenuOpen}
            >
              <Avatar sx={{ bgcolor: "#2c2c2c", width: 30, height: 30 }}>
                {user ? user.name?.charAt(0) : "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {user ? user.name : "Loading..."}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user ? user.role : ""}
                </Typography>
              </Box>
            </Box> */}
            <Avatar onClick={handleMenuOpen} sx={{ bgcolor: "#2c2c2c", width: 30, height: 30 }}>
  {user ? user.name?.charAt(0) : "U"}
</Avatar>
<Box>
  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
    {user ? user.name : "Guest"}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    {user ? user.role : "Visitor"}
  </Typography>
</Box>


            {/* Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {user && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ID: {user.id}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

