
require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");


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
 await mongoose.connect(process.env.MONGO_URI);

console.log("Mongo Connected");
console.log("DB Name:", mongoose.connection.name);
console.log("State:", mongoose.connection.readyState);
  const transactions = [];

  for (let i = 1; i <= 100; i++) {
    transactions.push({
      transactionId: `TXN${i}`,
      amount: Math.floor(Math.random() * 200000),
      sender: names[Math.floor(Math.random() * names.length)],
      receiver: names[Math.floor(Math.random() * names.length)],
    });
  }
  console.log("About to insert:", transactions.length);

  try {
    const result = await Transaction.insertMany(transactions);

    console.log("INSERT SUCCESS");
    console.log(result.length);
  } catch (err) {
    console.error("INSERT ERROR:");
    console.error(err);
  }
}

seedData();