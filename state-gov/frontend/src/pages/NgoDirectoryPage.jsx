// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import { FaWhatsapp } from "react-icons/fa";

// const API_BASE = "http://localhost:4000/api/agencies";

// export default function AgenciesPage() {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stateName, setStateName] = useState("");

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("pmAjayUser"));
//     if (user && user.stateName) {
//       setStateName(user.stateName);
//       fetchAgencies(user.stateName);
//     } else {
//       setError("State not found in localStorage");
//       setLoading(false);
//     }
//   }, []);

//   const fetchAgencies = async (state) => {
//     try {
//       const res = await fetch(`${API_BASE}/${encodeURIComponent(state)}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch agencies");
//       setAgencies(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 3, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
//       <Card sx={{ maxWidth: "95%", mx: "auto", p: 2, borderRadius: 3, boxShadow: 4 }}>
//         <CardContent>
//           <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50" }}>
//             Agencies in {stateName || "your state"}
//           </Typography>

//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
//               <CircularProgress />
//             </Box>
//           ) : error ? (
//             <Typography color="error" align="center">{error}</Typography>
//           ) : agencies.length === 0 ? (
//             <Typography color="text.secondary" align="center">
//               No agencies found for this state.
//             </Typography>
//           ) : (
//             <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: "70vh" }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "#1976d2" }}>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>S.No</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>Agency Type</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>Name</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>Email</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>Contact</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>District</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>State</TableCell>
//                     <TableCell sx={{ fontWeight: "bold", color: "black" }}>Connect</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {agencies.map((agency, index) => (
//                     <TableRow key={agency._id} hover>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>{agency.agencyType}</TableCell>
//                       <TableCell>{agency.name}</TableCell>
//                       <TableCell>{agency.email}</TableCell>
//                       <TableCell>{agency.contact}</TableCell>
//                       <TableCell>{agency.district}</TableCell>
//                       <TableCell>{agency.state}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           color="success"
//                           onClick={() => window.open(`https://wa.me/${agency.contact}`, "_blank")}
//                         >
//                           <FaWhatsapp size={20} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "http://localhost:4000/api/agencies";
const TASK_API = "http://localhost:5000/api/tasks";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "70vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  overflowY: "auto",
};

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateName, setStateName] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("pmAjayUser"));
    if (user && user.stateName) {
      setStateName(user.stateName);
      fetchAgencies(user.stateName);
    } else {
      setError("State not found in localStorage");
      setLoading(false);
    }
  }, []);

  const fetchAgencies = async (state) => {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(state)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch agencies");
      setAgencies(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAgencyClick = async (agency) => {
    setSelectedAgency(agency);
    setTaskLoading(true);
    setOpenModal(true);

    try {
      const res = await fetch(`${TASK_API}?email=${agency.email}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
      setTasks(data || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setTaskLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: "95%", mx: "auto", p: 2, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50" }}>
            Agencies in {stateName || "your state"}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : agencies.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No agencies found for this state.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: "70vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Agency Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>District</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>State</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Connect</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agencies.map((agency, index) => (
                    <TableRow
                      key={agency._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleAgencyClick(agency)}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{agency.agencyType}</TableCell>
                      <TableCell>{agency.name}</TableCell>
                      <TableCell>{agency.email}</TableCell>
                      <TableCell>{agency.contact}</TableCell>
                      <TableCell>{agency.district}</TableCell>
                      <TableCell>{agency.state}</TableCell>
                      <TableCell>
                        <IconButton
                          color="success"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal opening
                            window.open(`https://wa.me/${agency.contact}`, "_blank");
                          }}
                        >
                          <FaWhatsapp size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal for agency tasks */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tasks assigned to {selectedAgency?.name}
          </Typography>
          {taskLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "30vh" }}>
              <CircularProgress />
            </Box>
          ) : tasks.length === 0 ? (
            <Typography>No tasks assigned to this agency.</Typography>
          ) : (
            <List>
              {tasks.map((task, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #ccc" }}>
                  <ListItemText
                    primary={`Village: ${task.village.name}`}
                    secondary={`District: ${task.village.district}, State: ${task.village.state}, Task: ${task.village.development_task.task_name}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
