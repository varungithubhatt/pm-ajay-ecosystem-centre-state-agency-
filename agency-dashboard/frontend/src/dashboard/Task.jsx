import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Task() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [funds, setFunds] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [completedVillageIDs, setCompletedVillageIDs] = useState([]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        setMessage("No logged-in user found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/tasks?email=${email}`);
        const data = await res.json();
        if (res.ok) setTasks(data);
        else setMessage(data.message || "Failed to fetch tasks");
      } catch (err) {
        setMessage("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Fetch funds
  useEffect(() => {
    const fetchFunds = async () => {
      if (tasks.length === 0) return;
      const newFunds = {};

      await Promise.all(
        tasks.map(async (task) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/village-funds?villageID=${task.village.villageID}`
            );
            const data = await res.json();
            if (res.ok && data.fundsAllocated) {
              newFunds[task.village.villageID] = data.fundsAllocated;
            } else {
              newFunds[task.village.villageID] = null;
            }
          } catch {
            newFunds[task.village.villageID] = null;
          }
        })
      );

      setFunds(newFunds);
    };
    fetchFunds();
  }, [tasks]);

  // Fetch completed village IDs from previous-tasks
  // Fetch completed village IDs from previous-tasks
useEffect(() => {
  const fetchCompletedVillages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/previous-tasks`);
      const data = await res.json();
      if (res.ok && data.data) {
        // Store only village IDs
        const villageIDs = data.data.map((t) => t.villageID);
        console.log(villageIDs);
        setCompletedVillageIDs(villageIDs);
      } else {
        setCompletedVillageIDs([]);
      }
    } catch (err) {
      console.error("Error fetching completed villages:", err);
      setCompletedVillageIDs([]);
    }
  };
  fetchCompletedVillages();
}, []);


  if (loading)
    return (
      <p className="text-center mt-20 text-xl text-gray-600 animate-pulse">
        Loading tasks...
      </p>
    );

  if (message && tasks.length === 0)
    return <p className="text-center mt-20 text-red-600 text-lg">{message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      <div className="pt-24 flex flex-col items-center space-y-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4 text-center">
          My Tasks & Village Details
        </h1>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No tasks assigned yet.</p>
        ) : (
         
          tasks.map((task) => {
            const isCompleted = completedVillageIDs.includes( task.village.villageID.toString());
            console.log(isCompleted)
             console.log(task.village.villageID)
            return (
              <div
                key={task._id}
                className="relative bg-white shadow-2xl rounded-2xl p-10 border-l-8 border-indigo-600 w-[80vw] h-auto transform transition-all hover:scale-[1.02] flex flex-col justify-between"
              >
                {/* Status */}
                <p
                  className={`absolute top-5 left-8 font-semibold text-xl ${
                    isCompleted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCompleted ? "Completed" : task.village.development_task.status}
                </p>

                {/* Content */}
                <div className="space-y-6 mt-14">
                  {/* Village Info */}
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-indigo-800">
                      {task.village.name}, {task.village.district}, {task.village.state}
                    </h2>
                    <h3 className="text-gray-800 font-medium text-xl">
                      🆔 Village ID: {task.village.villageID}
                    </h3>
                    <p className="text-gray-700 text-lg">
                      📍 Location: Lat {task.village.location.latitude}, Long{" "}
                      {task.village.location.longitude}
                    </p>
                    <p className="text-gray-700 text-lg">
                      👥 Population: {task.village.population.total} (SC/ST:{" "}
                      {task.village.population.sc_st_percentage}%, Others:{" "}
                      {task.village.population.non_sc_st_percentage}%)
                    </p>
                  </div>

                  {/* Funds Info */}
                  <div className="pt-2">
                    <p className="text-indigo-700 font-semibold text-xl">
                      💰 Funds Allocated:{" "}
                      {funds[task.village.villageID] !== undefined
                        ? funds[task.village.villageID] !== null
                          ? `₹${funds[task.village.villageID].toLocaleString()}`
                          : "Not available"
                        : "Loading..."}
                    </p>
                  </div>

                  {/* Task Info */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-indigo-700 mt-6">
                      🛠 Task: {task.village.development_task.task_name}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {task.village.development_task.description}
                    </p>
                    <p className="text-gray-600 text-lg">
                      👤 Assigned To: {task.village.development_task.assigned_to}
                    </p>
                    <p className="text-lg text-green-700">
                      📅 Assigned On:{" "}
                      {new Date(task.village.development_task.assigned_on).toLocaleString()}
                    </p>
                    <p className="text-red-600 text-lg">
                      ⏳ Deadline:{" "}
                      {new Date(task.village.development_task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Submit Report */}
                <div className="flex justify-center mt-8 mb-2">
                  <button
                    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
                    onClick={() =>
                      navigate(`/update-progress/${task.village.villageID}`)
                    }
                  >
                    📤 Submit Report
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Task;
