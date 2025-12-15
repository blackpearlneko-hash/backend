require('dotenv').config();
const connectDB = require('./config/mongodb');
const express = require("express");
const cors = require('cors');
const productapi = require("./homeRoute/ProductRoute")


const app = express()
app.use(cors());
app.use(express.json());
connectDB();

app.use("/product", productapi)


const PORT = process.env.PORT || 5000;

console.log("Server file executed");
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})
