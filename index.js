require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");

const productapi = require("./homeRoute/ProductRoute");
const authroute = require("./homeRoute/profileRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "https://blackpearlneko-hash.github.io"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
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
