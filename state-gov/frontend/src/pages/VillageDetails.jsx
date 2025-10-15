// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Paper,
//   Modal,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 3,
//   borderRadius: 2,
// };

// export default function VillageDetailsPage() {
//   const { villageID } = useParams();
//   const [village, setVillage] = useState(null);
//   const [funds, setFunds] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fundLoading, setFundLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [agencies, setAgencies] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedAgency, setSelectedAgency] = useState(null);
//   const [taskLoading, setTaskLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   useEffect(() => {
//     const fetchVillage = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/villages/villageID/${villageID}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch village");
//         setVillage(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchFunds = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/village-funds/${villageID}`);
//         if (!res.ok) {
//           setFunds(null);
//         } else {
//           const data = await res.json();
//           setFunds(data.data || null);
//         }
//       } catch {
//         setFunds(null);
//       } finally {
//         setFundLoading(false);
//       }
//     };

//     fetchVillage();
//     fetchFunds();
//   }, [villageID]);

//   const handleAllocateAgency = async () => {
//     // Fetch agencies for the village state
//     try {
//       const res = await fetch(`http://localhost:4000/api/agencies/${village.state}`);
//       const data = await res.json();
//       setAgencies(data.data || []);
//       setOpenModal(true);
//     } catch (err) {
//       console.error("Failed to fetch agencies:", err);
//       setSnackbar({ open: true, message: "Failed to fetch agencies", severity: "error" });
//     }
//   };

//   const handleSelectAgency = async (agency) => {
//     setSelectedAgency(agency);
//     setTaskLoading(true);

//     const taskPayload = {
//       email: agency.email,
//       village: {
//         villageID: village.villageID,
//         name: village.villageName,
//         state: village.state,
//         district: village.district,
//         location: village.location,
//         population: {
//           total: village.description?.population || 0,
//           sc_st_percentage: village.description?.scPercentage || 0,
//           non_sc_st_percentage: village.description?.nonScStPercentage || 0,
//         },
//         development_task: {
//           task_name: village.developmentTasks?.[0]?.taskName || "General Development Task",
//           description: "Assigned task from PM-Ajay scheme",
//           assigned_to: agency.name,
//           assigned_on: new Date(),
//           deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
//           status: "Pending",
//         },
//       },
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/tasks/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(taskPayload),
//       });
//       if (!res.ok) throw new Error("Failed to assign task");
//       setSnackbar({ open: true, message: `Task assigned to ${agency.name}`, severity: "success" });
//       setOpenModal(false);
//     } catch (err) {
//       console.error(err);
//       setSnackbar({ open: true, message: "Failed to assign task", severity: "error" });
//     } finally {
//       setTaskLoading(false);
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
//   if (error)
//     return <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>{error}</Typography>;

//   const populationData = [
//     { name: "SC", value: village.description?.scPercentage || 0 },
//     { name: "ST", value: village.description?.stPercentage || 0 },
//     { name: "Non-SC/ST", value: village.description?.nonScStPercentage || 0 },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
//         {village.villageName} Details
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Basic Info */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Basic Info</Typography>
//               <Typography><strong>Village ID:</strong> {village.villageID}</Typography>
//               <Typography><strong>District:</strong> {village.district}</Typography>
//               <Typography><strong>State:</strong> {village.state}</Typography>
//               <Typography>
//                 <strong>Location:</strong> {village.location?.latitude}, {village.location?.longitude}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Population Chart */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Population Composition</Typography>
//               <PieChart width={250} height={250}>
//                 <Pie
//                   data={populationData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {populationData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Development Rate */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Rate</Typography>
//               <Typography variant="h3" color="#1e88e5">
//                 {village.description?.developmentRate || 0}%
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Problems */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Problems</Typography>
//               {village.description?.problems
//                 ? Object.entries(village.description.problems).map(([key, value]) => (
//                     <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
//                   ))
//                 : <Typography>No problems reported</Typography>
//               }
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Other Details */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Other Details</Typography>
//               <Typography>
//                 Last Selected for PMAjay:{" "}
//                 {village.description?.lastSelectedForPMAjay
//                   ? new Date(village.description.lastSelectedForPMAjay).toLocaleDateString()
//                   : "N/A"}
//               </Typography>
//               {village.description?.otherDetails &&
//                 Object.entries(village.description.otherDetails).map(([key, value]) => (
//                   <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
//                 ))
//               }
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Development Tasks */}
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Tasks</Typography>
//               {village.developmentTasks?.length > 0
//                 ? village.developmentTasks.map((task) => (
//                     <Typography key={task.taskID}>
//                       - {task.taskName} (Priority: {task.priority})
//                     </Typography>
//                   ))
//                 : <Typography>No tasks assigned</Typography>
//               }
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Funds Allocated */}
//       {!fundLoading && funds && (
//         <Paper sx={{ mt: 3, p: 2, textAlign: "center", backgroundColor: "#e3f2fd" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Funds Allocated: ₹{funds.fundsAllocated.toLocaleString()}
//           </Typography>
//         </Paper>
//       )}

//       {/* Allocate Agency */}
//       <Box sx={{ mt: 2 }}>
//         <Button variant="contained" color="secondary" onClick={handleAllocateAgency}>
//           Allocate Agency
//         </Button>
//       </Box>

//       {/* Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Select an agency for {village.state}
//           </Typography>
//           {agencies.length > 0 ? (
//             <List>
//               {agencies.map((agency) => (
//                 <ListItem key={agency._id} disablePadding>
//                   <ListItemButton onClick={() => handleSelectAgency(agency)} disabled={taskLoading}>
//                     <ListItemText primary={agency.name} secondary={agency.agencyType} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography>No agencies found for this state</Typography>
//           )}
//         </Box>
//       </Modal>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }
  

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Paper,
//   Modal,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 3,
//   borderRadius: 2,
// };

// export default function VillageDetailsPage() {
//   const { villageID } = useParams();
//   const [village, setVillage] = useState(null);
//   const [funds, setFunds] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fundLoading, setFundLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [agencies, setAgencies] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedAgency, setSelectedAgency] = useState(null);
//   const [taskLoading, setTaskLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   const [assignedAgency, setAssignedAgency] = useState(null);
//   const [disableAllocate, setDisableAllocate] = useState(false);

//   useEffect(() => {
//     const fetchVillage = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/villages/villageID/${villageID}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch village");
//         setVillage(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchFunds = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/village-funds/${villageID}`);
//         if (!res.ok) setFunds(null);
//         else {
//           const data = await res.json();
//           setFunds(data.data || null);
//         }
//       } catch {
//         setFunds(null);
//       } finally {
//         setFundLoading(false);
//       }
//     };

//     const checkAssignedAgency = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/tasks/${villageID}`);
//         if (res.ok) {
//           const data = await res.json();
//           if (data && data.length > 0) {
//             setAssignedAgency(data[0].village.development_task.assigned_to);
//             setDisableAllocate(true);
//           }
//         }
//       } catch (err) {
//         console.error("Error checking assigned agency:", err);
//       }
//     };

//     fetchVillage();
//     fetchFunds();
//     checkAssignedAgency();
//   }, [villageID]);

//   const handleAllocateAgency = async () => {
//     try {
//       const res = await fetch(`http://localhost:4000/api/agencies/${village.state}`);
//       const allAgencies = await res.json();
//       if (!res.ok) throw new Error("Failed to fetch agencies");

//       // Fetch all tasks to get already assigned agencies
//       const tasksRes = await fetch(`http://localhost:5000/api/tasks/all`);
//       const tasksData = await tasksRes.json();
//       const assignedEmails = tasksData.map((task) => task.email);

//       // Filter agencies which are already assigned
//       const availableAgencies = allAgencies.data.filter(
//         (agency) => !assignedEmails.includes(agency.email)
//       );

//       setAgencies(availableAgencies);
//       setOpenModal(true);
//     } catch (err) {
//       console.error("Failed to fetch agencies:", err);
//       setSnackbar({ open: true, message: "Failed to fetch agencies", severity: "error" });
//     }
//   };

//   const handleSelectAgency = async (agency) => {
//     setSelectedAgency(agency);
//     setTaskLoading(true);

//     const taskPayload = {
//       email: agency.email,
//       village: {
//         villageID: village.villageID,
//         name: village.villageName,
//         state: village.state,
//         district: village.district,
//         location: village.location,
//         population: {
//           total: village.description?.population || 0,
//           sc_st_percentage: village.description?.scPercentage || 0,
//           non_sc_st_percentage: village.description?.nonScStPercentage || 0,
//         },
//         development_task: {
//           task_name: village.developmentTasks?.[0]?.taskName || "General Development Task",
//           description: "Assigned task from PM-Ajay scheme",
//           assigned_to: agency.name,
//           assigned_on: new Date(),
//           deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
//           status: "Pending",
//         },
//       },
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/tasks/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(taskPayload),
//       });
//       if (!res.ok) throw new Error("Failed to assign task");
//       setSnackbar({ open: true, message: `Task assigned to ${agency.name}`, severity: "success" });
//       setOpenModal(false);
//       setAssignedAgency(agency.name);
//       setDisableAllocate(true);
//     } catch (err) {
//       console.error(err);
//       setSnackbar({ open: true, message: "Failed to assign task", severity: "error" });
//     } finally {
//       setTaskLoading(false);
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
//   if (error)
//     return <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>{error}</Typography>;

//   const populationData = [
//     { name: "SC", value: village.description?.scPercentage || 0 },
//     { name: "ST", value: village.description?.stPercentage || 0 },
//     { name: "Non-SC/ST", value: village.description?.nonScStPercentage || 0 },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
//         {village.villageName} Details
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Basic Info */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Basic Info</Typography>
//               <Typography><strong>Village ID:</strong> {village.villageID}</Typography>
//               <Typography><strong>District:</strong> {village.district}</Typography>
//               <Typography><strong>State:</strong> {village.state}</Typography>
//               <Typography>
//                 <strong>Location:</strong> {village.location?.latitude}, {village.location?.longitude}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Population Chart */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Population Composition</Typography>
//               <PieChart width={250} height={250}>
//                 <Pie
//                   data={populationData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {populationData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Development Rate */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: "center" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Rate</Typography>
//               <Typography variant="h3" color="#1e88e5">
//                 {village.description?.developmentRate || 0}%
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Problems */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Problems</Typography>
//               {village.description?.problems
//                 ? Object.entries(village.description.problems).map(([key, value]) => (
//                     <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
//                   ))
//                 : <Typography>No problems reported</Typography>
//               }
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Other Details */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Other Details</Typography>
//               <Typography>
//                 Last Selected for PMAjay:{" "}
//                 {village.description?.lastSelectedForPMAjay
//                   ? new Date(village.description.lastSelectedForPMAjay).toLocaleDateString()
//                   : "N/A"}
//               </Typography>
//               {village.description?.otherDetails &&
//                 Object.entries(village.description.otherDetails).map(([key, value]) => (
//                   <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
//                 ))
//               }
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Development Tasks */}
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Tasks</Typography>
//               {village.developmentTasks?.length > 0
//                 ? village.developmentTasks.map((task) => (
//                     <Typography key={task.taskID}>
//                       - {task.taskName} (Priority: {task.priority})
//                     </Typography>
//                   ))
//                 : <Typography>No tasks assigned</Typography>
//               }
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Funds Allocated */}
//       {!fundLoading && funds && (
//         <Paper sx={{ mt: 3, p: 2, textAlign: "center", backgroundColor: "#e3f2fd" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Funds Allocated: ₹{funds.fundsAllocated.toLocaleString()}
//           </Typography>
//         </Paper>
//       )}

//       {/* Allocate Agency */}
//       <Box sx={{ mt: 2 }}>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleAllocateAgency}
//           disabled={disableAllocate}
//         >
//           {disableAllocate ? `Allocated to: ${assignedAgency}` : "Allocate Agency"}
//         </Button>
//       </Box>

//       {/* Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Select an agency for {village.state}
//           </Typography>
//           {agencies.length > 0 ? (
//             <List>
//               {agencies.map((agency) => (
//                 <ListItem key={agency._id} disablePadding>
//                   <ListItemButton onClick={() => handleSelectAgency(agency)} disabled={taskLoading}>
//                     <ListItemText primary={agency.name} secondary={agency.agencyType} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography>No agencies found for this state</Typography>
//           )}
//         </Box>
//       </Modal>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

export default function VillageDetailsPage() {
  const { villageID } = useParams();
  const [village, setVillage] = useState(null);
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundLoading, setFundLoading] = useState(true);
  const [error, setError] = useState(null);

  const [agencies, setAgencies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [assignedAgency, setAssignedAgency] = useState(null);
  const [disableAllocate, setDisableAllocate] = useState(false);

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/villages/villageID/${villageID}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch village");
        setVillage(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFunds = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/village-funds/${villageID}`);
        if (!res.ok) setFunds(null);
        else {
          const data = await res.json();
          setFunds(data.data || null);
        }
      } catch {
        setFunds(null);
      } finally {
        setFundLoading(false);
      }
    };

    const checkAssignedAgency = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks?villageID=${villageID}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setAssignedAgency(data[0].village.development_task.assigned_to);
            setDisableAllocate(true); // village can only be assigned once
          }
        }
      } catch (err) {
        console.error("Error checking assigned agency:", err);
      }
    };

    fetchVillage();
    fetchFunds();
    checkAssignedAgency();
  }, [villageID]);

  const handleAllocateAgency = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/agencies/${village.state}`);
      const allAgencies = await res.json();
      if (!res.ok) throw new Error("Failed to fetch agencies");

      setAgencies(allAgencies.data);
      setOpenModal(true);
    } catch (err) {
      console.error("Failed to fetch agencies:", err);
      setSnackbar({ open: true, message: "Failed to fetch agencies", severity: "error" });
    }
  };

  const handleSelectAgency = async (agency) => {
    setSelectedAgency(agency);
    setTaskLoading(true);

    const taskPayload = {
      email: agency.email,
      village: {
        villageID: village.villageID,
        name: village.villageName,
        state: village.state,
        district: village.district,
        location: village.location,
        population: {
          total: village.description?.population || 0,
          sc_st_percentage: village.description?.scPercentage || 0,
          non_sc_st_percentage: village.description?.nonScStPercentage || 0,
        },
        development_task: {
          task_name: village.developmentTasks?.[0]?.taskName || "General Development Task",
          description: "Assigned task from PM-Ajay scheme",
          assigned_to: agency.name,
          assigned_on: new Date(),
          deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: "Pending",
        },
      },
    };

    try {
      const res = await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });
      if (!res.ok) throw new Error("Failed to assign task");

      setSnackbar({ open: true, message: `Task assigned to ${agency.name}`, severity: "success" });
      setOpenModal(false);
      setAssignedAgency(agency.name);
      setDisableAllocate(true); // village is now assigned
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to assign task", severity: "error" });
    } finally {
      setTaskLoading(false);
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error)
    return <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>{error}</Typography>;

  const populationData = [
    { name: "SC", value: village.description?.scPercentage || 0 },
    { name: "ST", value: village.description?.stPercentage || 0 },
    { name: "Non-SC/ST", value: village.description?.nonScStPercentage || 0 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        {village.villageName} Details
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Basic Info</Typography>
              <Typography><strong>Village ID:</strong> {village.villageID}</Typography>
              <Typography><strong>District:</strong> {village.district}</Typography>
              <Typography><strong>State:</strong> {village.state}</Typography>
              <Typography>
                <strong>Location:</strong> {village.location?.latitude}, {village.location?.longitude}
              </Typography>
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
                {village.description?.developmentRate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Problems */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Problems</Typography>
              {village.description?.problems
                ? Object.entries(village.description.problems).map(([key, value]) => (
                    <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
                  ))
                : <Typography>No problems reported</Typography>
              }
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
                {village.description?.lastSelectedForPMAjay
                  ? new Date(village.description.lastSelectedForPMAjay).toLocaleDateString()
                  : "N/A"}
              </Typography>
              {village.description?.otherDetails &&
                Object.entries(village.description.otherDetails).map(([key, value]) => (
                  <Typography key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Typography>
                ))
              }
            </CardContent>
          </Card>
        </Grid>

        {/* Development Tasks */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Development Tasks</Typography>
              {village.developmentTasks?.length > 0
                ? village.developmentTasks.map((task) => (
                    <Typography key={task.taskID}>
                      - {task.taskName} (Priority: {task.priority})
                    </Typography>
                  ))
                : <Typography>No tasks assigned</Typography>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Funds Allocated */}
      {!fundLoading && funds && (
        <Paper sx={{ mt: 3, p: 2, textAlign: "center", backgroundColor: "#e3f2fd" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Funds Allocated: ₹{funds.fundsAllocated.toLocaleString()}
          </Typography>
        </Paper>
      )}

      {/* Allocate Agency */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAllocateAgency}
          disabled={disableAllocate}
        >
          {disableAllocate ? `Allocated to: ${assignedAgency}` : "Allocate Agency"}
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select an agency for {village.state}
          </Typography>
          {agencies.length > 0 ? (
            <List>
              {agencies.map((agency) => (
                <ListItem key={agency._id} disablePadding>
                  <ListItemButton onClick={() => handleSelectAgency(agency)} disabled={taskLoading}>
                    <ListItemText primary={agency.name} secondary={agency.agencyType} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No agencies found for this state</Typography>
          )}
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

