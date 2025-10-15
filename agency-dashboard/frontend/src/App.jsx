import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./login/Login_page";
import Signup from "./login/Signup_page";
import Dashboard from "./dashboard/Dashboard";
import Profile from "./dashboard/Profile";
import Task from "./dashboard/Task";
import UpdateProgress from "./dashboard/UpdateProgress";
import Funds from "./dashboard/Funds";
import PreviousTasks from "./dashboard/PreviousTasks";
import Progress from "./dashboard/Progress";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/task" element={<Task />} />
      <Route path="/updateProgress" element={<UpdateProgress />} />
      <Route path="/funds" element={<Funds />} />
      <Route path="/previous-tasks" element={<PreviousTasks />} />
      <Route path="/update-progress/:villageID" element={<UpdateProgress />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  );
}

export default App;
