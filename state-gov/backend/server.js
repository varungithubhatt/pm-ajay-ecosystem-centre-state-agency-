require('dotenv').config();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ngoRoutes = require('./routes/agencies.js');
const taskRoutes = require("./routes/tasks");
const overviewRoutes = require('./routes/overview');
const bankAccountRoutes = require("./routes/bankAccount");
const authRoutes = require('./routes/auth');
const assignRoutes = require('./routes/assign');
const VillageSchema = require("./models/village.js");
const progressRoutes = require('./routes/progressRoutes');
const villageRoutes = require("./routes/villageRoutes");
const villagefundsRoutes = require("./routes/villagefunds");
const agenciesRoutes = require("./routes/agencies");
const app = express();

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

   const villageConnection = mongoose.createConnection(process.env.MONGO_URI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

villageConnection.on("connected", () => {
  console.log("✅ MongoDB connected (Village DB)");
});

villageConnection.on("error", (err) => {
  console.error("❌ Village DB error:", err);
});

const Village = villageConnection.model("Village", VillageSchema);

//report database
const thirdConnection = mongoose.createConnection(process.env.MONGO_URI3, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

thirdConnection.on("connected", () => {
  console.log("✅ MongoDB connected (Third DB)");
});

thirdConnection.on("error", (err) => {
  console.error("❌ Third DB error:", err);
});

app.get("/api/villages", async (req, res) => {
  try {
    const villages = await Village.find();
     const fundAllocations = villages.flatMap((village) =>
      (village.fundAllocations || []).map((fund) => ({
        villageID: village.villageID,
        villageName: village.villageName,
        district: village.district,
        state: village.state,
        amount: fund.amount,
        allocatedBy: fund.allocatedBy,
        allocatedAt: fund.allocatedAt,
      }))
    );

    return res.status(200).json({ data: fundAllocations });
  } catch (err) {
    console.error("Error fetching villages:", err);
    res.status(500).json({ error: "Failed to fetch villages" });
  }
});


// Routes registration
app.use('/ngos', ngoRoutes);
app.use("/tasks", taskRoutes);
app.use('/overview', overviewRoutes);
app.use("/bank-account", bankAccountRoutes)
app.use('/api/auth', authRoutes);
app.use('/assign', assignRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/village-funds", villagefundsRoutes);
app.use("/api/agencies", agenciesRoutes);

// app.use("/village", villageRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));