const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

mongoose.connect("mongodb+srv://mansiy265_db_user:gplfFgcxYX7oaCml@cluster0.rgq50bc.mongodb.net/financialCrimeDB?retryWrites=true&w=majority&appName=Cluster0");

const names = [
  "Alice",
  "Bob",
  "John",
  "Sara",
  "Mike",
  "Tom",
  "Harry",
  "Emma",
];

async function seedData() {
  const transactions = [];

  for (let i = 1; i <= 100; i++) {
    transactions.push({
      transactionId: `TXN${i}`,
      amount: Math.floor(Math.random() * 200000),
      sender: names[Math.floor(Math.random() * names.length)],
      receiver: names[Math.floor(Math.random() * names.length)],
    });
  }

  await Transaction.insertMany(transactions);

  console.log("100 transactions inserted");
  process.exit();
}

seedData();