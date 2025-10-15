import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2096F3", "#43E97B", "#FFD600"];

// Optional demo for fallback only if API fails
const demoTasks = [
  {
    _id: "demo1",
    title: "Health Awareness Drive",
    ngoId: { name: "Sunshine Charity" },
    fundAllocated: 500000,
    startDate: "2025-04-01",
    deadline: "2025-06-30",
    status: "Completed",
    assignedDate: "2025-03-25T12:15:00Z",
    completedDate: "2025-09-28T12:00:00Z",
  },
];

export default function MonitoringPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = () => {
      axios
        .get("http://localhost:4000/assign")
        .then((res) => {
          if (!res.data || res.data.length === 0) setTasks(demoTasks);
          else setTasks(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch tasks");
          setTasks(demoTasks);
          setLoading(false);
        });
    };

    fetchTasks();

    const intervalId = setInterval(fetchTasks, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Count tasks by status
  const taskCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: "Pending", value: taskCounts["Pending"] || 0 },
    { name: "In Progress", value: taskCounts["In Progress"] || 0 },
    { name: "Completed", value: taskCounts["Completed"] || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-gray-50 to-indigo-100 pb-16 font-sans flex flex-col">
      {/* Topbar */}
      <header className="w-full relative">
        <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 flex flex-col justify-center px-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg mb-2">
            Monitoring Dashboard
          </h1>
          <span className="text-lg text-blue-50 font-medium">
            Track and analyze all NGO task progress here.
          </span>
        </div>
        <svg
          viewBox="0 0 1500 80"
          className="absolute left-0 bottom-0 w-full h-16"
          fill="none"
        >
          <path
            d="M0 40 Q375 80 750 40T1500 40V80H0V40Z"
            fill="#f8fafc"
            fillOpacity="0.36"
          />
        </svg>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 w-full">
        {loading && (
          <div className="text-lg text-gray-700 text-center py-10">
            Loading tasks...
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center py-3 font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Overview: Pie chart */}
            <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-900">
                  Task Status Overview
                </h2>
                <div className="bg-white/80 rounded-xl shadow-lg p-7">
                  <PieChart width={350} height={250}>
                    <Pie
                      data={data}
                      cx={160}
                      cy={120}
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </div>
              </div>
              <div className="flex-1 bg-white/80 rounded-xl shadow-md p-8 mt-3 md:mt-0">
                <div className="font-semibold text-blue-800 mb-4 text-xl">
                  Live Insights
                </div>
                <ul className="list-disc ml-6 text-gray-600 space-y-2">
                  <li>Tasks are updated in real time.</li>
                  <li>Pie chart shows proportional distribution by status.</li>
                  <li>Click on any row for more info (coming soon).</li>
                </ul>
              </div>
            </section>

            {/* Tasks Table */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-blue-900">All Tasks</h2>
              <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-lg bg-white/80">
                <table className="min-w-full">
                  <thead className="bg-blue-50 border-b border-blue-100">
                    <tr>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Task Title
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        NGO
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Funds Allocated (₹)
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Start Date
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Deadline
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Status
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Assigned Date
                      </th>
                      <th className="py-3 px-6 text-left font-bold text-blue-700">
                        Completed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b border-blue-50 hover:bg-indigo-50/50 transition"
                      >
                        <td className="py-3 px-6 font-medium text-gray-900">
                          {task.title}
                        </td>
                        <td className="py-3 px-6">{task.ngoId?.name || "N/A"}</td>
                        <td className="py-3 px-6">{task.fundAllocated}</td>
                        <td className="py-3 px-6">
                          {new Date(task.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6">
                          {new Date(task.deadline).toLocaleDateString()}
                        </td>
                        <td
                          className={`py-3 px-6 font-semibold ${
                            task.status === "Completed"
                              ? "text-green-600"
                              : task.status === "In Progress"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {task.status}
                        </td>
                        <td className="py-3 px-6">
                          {new Date(task.assignedDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6">
                          {task.completedDate
                            ? new Date(task.completedDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
      <footer className="bg-blue-100 text-gray-700 text-sm py-6 px-6 border-t border-blue-200 text-center w-full mt-auto">
        &copy; {new Date().getFullYear()} PM-AJAY Monitoring Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
