
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import SchemeForm from './Forms/SchemeForm';
import FundAllocate from './Forms/FundAllocate';
import SchemeRecord from './components/SchemeRecord';
import FundRecord from './components/FundRecord';
import PrivateRoute from './components/PrivateRoute';
import VillagesPage from './components/VillagesPage';
import VillageDetailsPage from './components/VillageDetailsPage';
import VillageFundRecord from './components/VillageFundRecord';
import ProgressReports from './components/ProgressReports';
import AddVillage from './components/AddVillage';
import './App.css'




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/villages/:id" element={<VillageDetailsPage />} />

        <Route path="/scheme/upload" element={<SchemeForm />} />
        <Route path="/fund/allocate" element={<FundAllocate />} />
        <Route path="/scheme/record" element={<SchemeRecord />} />
        <Route path="/funds/records" element={<FundRecord />} />
        <Route path="/villages" element={<VillagesPage />} />
      
        <Route path="/villages/funds/records" element={<VillageFundRecord />} />
        <Route path="/progress-reports" element={<ProgressReports />} />
        <Route path="/add-village" element={<AddVillage />} />

      </Routes>
    </Router>
  );
}

export default App;
