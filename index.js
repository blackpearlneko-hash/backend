require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");

const productapi = require("./homeRoute/ProductRoute");
const authroute = require("./homeRoute/profileRoute");

const app = express();

// ✅ CORS — ONLY ONCE, BEFORE ROUTES
app.use(cors({
    origin: "*", // This replaces the list of URLs and allows everything
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// app.options(/.*/, cors());

app.use(express.json());
connectDB();


app.use("/product", productapi);
app.use("/api/auth", authroute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
