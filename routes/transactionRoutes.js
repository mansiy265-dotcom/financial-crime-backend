const express = require("express");
const router = express.Router();
console.log("Transaction Routes Loaded");

const {
  getTransactions,
  getSuspiciousTransactions,
  getFraudAnalysis,
  getStats,
} = require("../controllers/transactionController");

router.get("/", getTransactions);
router.get("/suspicious", getSuspiciousTransactions);
router.get("/analysis", getFraudAnalysis);
router.get("/stats", getStats);
router.get("/stats", (req, res) => {
  res.json({ message: "stats route working" });
});

module.exports = router;