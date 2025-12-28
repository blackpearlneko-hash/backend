require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");

const productapi = require("./homeRoute/ProductRoute");
const authroute = require("./homeRoute/profileRoute");

const app = express();

app.use(cors({
origin: "https://blackpearlneko-hash.github.io",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json());
app.use(cookieParser());
connectDB();


app.use("/product", productapi);
app.use("/api/auth", authroute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
