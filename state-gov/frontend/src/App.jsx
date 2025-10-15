import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage.jsx";
import NgoDirectoryPage from './pages/NgoDirectoryPage';
import MonitoringPage from "./pages/MonitoringPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import FundsMenuCard from "./pages/FundsMenuCard.jsx";
import Progress from "./pages/Progress.jsx";
import VillageList from "./pages/VillageList.jsx";
import VillageDetailsPage from "./pages/VillageDetails.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ngos" element={<NgoDirectoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tasks" element={<MonitoringPage/>}/>
        <Route path="/overview" element={<OverviewPage/>}/>
        <Route path="/funds" element={<FundsMenuCard accountId="12345"/>}/>
        <Route path="/progress" element={<Progress />} />
        <Route path="/villages-list" element={<VillageList />} />
        <Route path="/village/:villageID" element={<VillageDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
