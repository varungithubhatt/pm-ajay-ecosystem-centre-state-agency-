import React, { useState } from "react";

const initialProblems = [{ key: "", value: "" }];
const initialOtherDetails = [{ key: "", value: "" }];

export default function VillageForm() {
  const [villageID, setVillageID] = useState("");
  const [villageName, setVillageName] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [population, setPopulation] = useState("");
  const [scPercentage, setScPercentage] = useState("");
  const [stPercentage, setStPercentage] = useState("");
  const [nonScStPercentage, setNonScStPercentage] = useState("");
  const [developmentRate, setDevelopmentRate] = useState("");
  const [problems, setProblems] = useState(initialProblems);
  const [lastSelectedForPMAjay, setLastSelectedForPMAjay] = useState("");
  const [otherDetails, setOtherDetails] = useState(initialOtherDetails);
  const [fundAllocations, setFundAllocations] = useState([
    { amount: "", allocatedBy: "" },
  ]);
  const [developmentTasks, setDevelopmentTasks] = useState([
    { taskID: "", taskName: "", priority: "Medium" },
  ]);
  const [uploadedBy, setUploadedBy] = useState("");

  const addProblemField = () => {
    setProblems([...problems, { key: "", value: "" }]);
  };
  const removeProblemField = (index) => {
    const newProblems = [...problems];
    newProblems.splice(index, 1);
    setProblems(newProblems);
  };
  const handleProblemChange = (index, field, value) => {
    const newProblems = [...problems];
    newProblems[index][field] = value;
    setProblems(newProblems);
  };

  const addOtherDetailField = () => {
    setOtherDetails([...otherDetails, { key: "", value: "" }]);
  };
  const removeOtherDetailField = (index) => {
    const newDetails = [...otherDetails];
    newDetails.splice(index, 1);
    setOtherDetails(newDetails);
  };
  const handleOtherDetailChange = (index, field, value) => {
    const newDetails = [...otherDetails];
    newDetails[index][field] = value;
    setOtherDetails(newDetails);
  };

  const addFundAllocation = () => {
    setFundAllocations([...fundAllocations, { amount: "", allocatedBy: "" }]);
  };
  const removeFundAllocation = (index) => {
    const newFunds = [...fundAllocations];
    newFunds.splice(index, 1);
    setFundAllocations(newFunds);
  };
  const handleFundChange = (index, field, value) => {
    const newFunds = [...fundAllocations];
    newFunds[index][field] = value;
    setFundAllocations(newFunds);
  };

  const addDevelopmentTask = () => {
    setDevelopmentTasks([
      ...developmentTasks,
      { taskID: "", taskName: "", priority: "Medium" },
    ]);
  };
  const removeDevelopmentTask = (index) => {
    const newTasks = [...developmentTasks];
    newTasks.splice(index, 1);
    setDevelopmentTasks(newTasks);
  };
  const handleDevelopmentTaskChange = (index, field, value) => {
    const newTasks = [...developmentTasks];
    newTasks[index][field] = value;
    setDevelopmentTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare problems and otherDetails as Maps
    const problemsMap = {};
    problems.forEach(({ key, value }) => {
      if (key.trim()) problemsMap[key.trim()] = value.trim();
    });
    const otherDetailsMap = {};
    otherDetails.forEach(({ key, value }) => {
      if (key.trim()) otherDetailsMap[key.trim()] = value.trim();
    });

    const payload = {
      villageID: Number(villageID),
      villageName,
      state: stateName,
      district,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      description: {
        population: population ? Number(population) : 0,
        scPercentage: Number(scPercentage),
        stPercentage: Number(stPercentage),
        nonScStPercentage: Number(nonScStPercentage),
        developmentRate: Number(developmentRate),
        problems: problemsMap,
        lastSelectedForPMAjay: lastSelectedForPMAjay ? new Date(lastSelectedForPMAjay) : null,
        otherDetails: otherDetailsMap,
      },
      fundAllocations: fundAllocations
        .filter((item) => item.amount && item.allocatedBy)
        .map((item) => ({
          amount: Number(item.amount),
          allocatedBy: item.allocatedBy,
        })),
      developmentTasks: developmentTasks
        .filter((task) => task.taskID && task.taskName)
        .map((task) => ({
          taskID: task.taskID,
          taskName: task.taskName,
          priority: task.priority,
        })),
      upload_data: {
        uploadedBy,
        uploadDate: new Date(),
      },
    };

    try {
      const response = await fetch("http://localhost:7000/add-village", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Village data submitted successfully!");
        // Reset form or keep as needed
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      alert("Error submitting data: " + error.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
        background: "linear-gradient(135deg, #e8f665ff 0%, #766a66ff 100%)",
        borderRadius: "15px",
        boxShadow:
          "0 10px 15px rgba(246, 211, 101, 0.5), 0 4px 6px rgba(253, 160, 133, 0.5)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#451a03", marginBottom: 20 }}>
        Enter Village Details
      </h1>
      <form onSubmit={handleSubmit} style={{ color: "#451a03" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="number"
            placeholder="Village ID"
            value={villageID}
            onChange={(e) => setVillageID(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Village Name"
            value={villageName}
            onChange={(e) => setVillageName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <h3 style={{ marginTop: 20 }}>Location (Latitude, Longitude)</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <h3 style={{ marginTop: 20 }}>Description</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="number"
            placeholder="Population"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="SC Percentage"
            value={scPercentage}
            onChange={(e) => setScPercentage(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="ST Percentage"
            value={stPercentage}
            onChange={(e) => setStPercentage(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Non SC/ST Percentage"
            value={nonScStPercentage}
            onChange={(e) => setNonScStPercentage(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Development Rate"
            value={developmentRate}
            onChange={(e) => setDevelopmentRate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Problems dynamic fields */}
        <h3 style={{ marginTop: 20 }}>Problems</h3>
        {problems.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Problem Key"
              value={item.key}
              onChange={(e) =>
                handleProblemChange(index, "key", e.target.value)
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Problem Description"
              value={item.value}
              onChange={(e) =>
                handleProblemChange(index, "value", e.target.value)
              }
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => removeProblemField(index)}
              style={removeButtonStyle}
              disabled={problems.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProblemField}
          style={addButtonStyle}
        >
          + Add Problem
        </button>

        {/* Last selected for PMAjay date */}
        <h3 style={{ marginTop: 20 }}>Last Selected For PM Ajay</h3>
        <input
          type="date"
          value={lastSelectedForPMAjay}
          onChange={(e) => setLastSelectedForPMAjay(e.target.value)}
          style={inputStyle}
        />

        {/* Other Details dynamic fields */}
        <h3 style={{ marginTop: 20 }}>Other Details</h3>
        {otherDetails.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) =>
                handleOtherDetailChange(index, "key", e.target.value)
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) =>
                handleOtherDetailChange(index, "value", e.target.value)
              }
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => removeOtherDetailField(index)}
              style={removeButtonStyle}
              disabled={otherDetails.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOtherDetailField}
          style={addButtonStyle}
        >
          + Add Other Detail
        </button>

        

        {/* Development Tasks */}
        <h3 style={{ marginTop: 20 }}>Development Tasks</h3>
        {developmentTasks.map((task, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Task ID"
              value={task.taskID}
              onChange={(e) =>
                handleDevelopmentTaskChange(index, "taskID", e.target.value)
              }
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Task Name"
              value={task.taskName}
              onChange={(e) =>
                handleDevelopmentTaskChange(index, "taskName", e.target.value)
              }
              required
              style={inputStyle}
            />
            <select
              value={task.priority}
              onChange={(e) =>
                handleDevelopmentTaskChange(index, "priority", e.target.value)
              }
              style={inputStyle}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              type="button"
              onClick={() => removeDevelopmentTask(index)}
              style={removeButtonStyle}
              disabled={developmentTasks.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addDevelopmentTask}
          style={addButtonStyle}
        >
          + Add Development Task
        </button>

        {/* Uploaded By */}
        <h3 style={{ marginTop: 20 }}>Uploaded By</h3>
        <input
          type="text"
          placeholder="Uploaded By (Name/ID)"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "25px",
            backgroundColor: "#451a03",
            color: "white",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 0 10px #c2701d",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#7e4e00")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#451a03")}
        >
          Submit Village Details
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  flex: "1 1 200px",
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxShadow: "0 0 5px #bb7330 inset",
};

const addButtonStyle = {
  backgroundColor: "#7e4e00",
  border: "none",
  color: "white",
  padding: "8px 15px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 0 6px #c2701d",
};

const removeButtonStyle = {
  backgroundColor: "#c84444",
  border: "none",
  color: "white",
  padding: "8px 12px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "pointer",
};
