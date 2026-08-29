const express = require("express");
const connectDB = require("./config/db");

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connect
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Financial Crime Backend Running");
});
app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});
// Transaction Routes
app.use("/transactions", transactionRoutes);

// Server Start
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});