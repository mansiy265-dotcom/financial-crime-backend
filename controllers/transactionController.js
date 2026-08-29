const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

const getSuspiciousTransactions = async (req, res) => {
  const transactions = await Transaction.find();

  const suspicious = transactions.filter(
    (transaction) => transaction.amount > 100000
  );

  res.json(suspicious);
};

const getFraudAnalysis = async (req, res) => {
  const transactions = await Transaction.find();

  const analysis = transactions.map((tx) => {
    let risk = "LOW";

    if (tx.amount > 100000) {
      risk = "HIGH";
    } else if (tx.amount > 50000) {
      risk = "MEDIUM";
    }

    return {
      ...tx.toObject(),
      risk,
    };
  });

  res.json(analysis);
};

const getStats = async (req, res) => {
  const transactions = await Transaction.find();

  const total = transactions.length;

  const suspicious = transactions.filter(
    t => t.amount > 100000
  ).length;

  const totalAmount = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  res.json({
    totalTransactions: total,
    suspiciousTransactions: suspicious,
    totalAmount
  });
};
module.exports = {
  getTransactions,
  getSuspiciousTransactions,
  getFraudAnalysis,
  getStats
};