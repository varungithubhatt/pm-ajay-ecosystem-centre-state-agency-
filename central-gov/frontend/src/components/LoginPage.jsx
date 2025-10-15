// import * as React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, registerUser } from '../features/auth/authSlice';
// import {
//   Avatar, Button, CssBaseline, TextField, Grid, Paper,
//   Box, Snackbar, Typography
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';




// const defaultTheme = createTheme();

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const { status, error, message, loggedIn } = useSelector((state) => state.auth);

//   const [formState, setFormState] = React.useState(0); // 0=login, 1=register
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [name, setName] = React.useState("");
//   const [role, setRole] = React.useState(""); // new
//   const [designation, setDesignation] = React.useState(""); // new
//   const [open, setOpen] = React.useState(false);

//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (message) setOpen(true);
//   }, [message]);

//   const handleAuth = () => {
//     if (formState === 0) {
//       dispatch(loginUser({ email, password }));
//       if (loggedIn) {
//         navigate("/dashboard");
//       }
      
    

//     } else {
//       dispatch(registerUser({ name, email, password, role, designation }));
      
//       setName("");
//       setEmail("");
//       setPassword("");
//       setRole("");
//       setDesignation("");

//       navigate("/login");
//     }
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: `url(/images/Screenshot 2024-09-10 220126.png))`,
//             border:'2px solid black',
//             backgroundRepeat: 'no-repeat',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             height: '100vh',
//           }}
//         />
//         <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
//           <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//               <LockOutlinedIcon />
//             </Avatar>
//             <Typography component="h1" variant="h5">
//               {formState === 0 ? "Sign In" : "Sign Up"}
//             </Typography>
//             <Box sx={{ mt: 1, my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               {formState === 1 && (
//                 <>
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     label="Full Name"
//                     value={name}
//                     autoFocus
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                   <TextField
//                     margin="normal"
//                     fullWidth
//                     label="Role"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                   />
//                   <TextField
//                     margin="normal"
//                     fullWidth
//                     label="Designation"
//                     value={designation}
//                     onChange={(e) => setDesignation(e.target.value)}
//                   />
//                 </>
//               )}
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               {error && <Typography color="error">{error}</Typography>}
//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 onClick={handleAuth}
//                 disabled={status === "loading"}
//               >
//                 {formState === 0 ? "Login" : "Register"}
//               </Button>
//               <Button onClick={() => setFormState(formState === 0 ? 1 : 0)}>
//                 {formState === 0 ? "Switch to Sign Up" : "Switch to Sign In"}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//       <Snackbar
//         open={open}
//         autoHideDuration={4000}
//         message={message}
//         onClose={() => setOpen(false)}
//       />
//     </ThemeProvider>
//   );
// }



import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, Snackbar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { status, error, message, loggedIn } = useSelector((state) => state.auth);

  const [formState, setFormState] = React.useState(0); // 0 = login, 1 = signup
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setFormState(formState === 0 ? 1 : 0);
  };

  React.useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  // ✅ Navigation after successful login
  React.useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  const handleAuth = () => {
    if (formState === 0) {
      // Login
      dispatch(loginUser({ email, password }));
    } else {
      // Register
      dispatch(registerUser({ name, email, password, role, designation }))
        .then(() => {
          // Reset fields
          setName("");
          setEmail("");
          setPassword("");
          setRole("");
          setDesignation("");
          // Switch back to login form
          toggleForm();
        });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Card
          sx={{
            border: "2px solid black",
            boxShadow: "inherit",
            borderRadius: "10px",
            height: "auto",
            width: "70vw",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Lock Icon in Circle */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "secondary.main",
                color: "white",
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* Heading */}
            <Typography variant="h5" align="center" gutterBottom>
              {formState === 0 ? "Sign In" : "Sign Up"}
            </Typography>

            {/* Error Message */}
            {error && <Typography color="error">{error}</Typography>}

            {/* Form Fields */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              {formState === 1 && (
                <TextField
                  sx={{ width: "50%" }}
                  margin="normal"
                  required
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                sx={{ width: "50%" }}
                margin="normal"
                required
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{ width: "50%" }}
                margin="normal"
                required
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {formState === 1 && (
                <>
                  <TextField
                    sx={{ width: "50%" }}
                    margin="normal"
                    required
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <TextField
                    sx={{ width: "50%" }}
                    margin="normal"
                    required
                    label="Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </>
              )}

              {/* Submit Button */}
              <Button
                variant="contained"
                sx={{ mt: 2, width: "50%" }}
                type="submit"
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>

              {/* Switch Button */}
              <Button sx={{ mt: 1 }} onClick={toggleForm}>
                {formState === 0 ? "Switch to Sign Up" : "Switch to Sign In"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
        ContentProps={{
          sx: { backgroundColor: error ? "red" : "green" }
        }}
      />
    </>
  );
}


