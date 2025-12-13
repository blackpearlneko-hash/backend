require('dotenv').config();
const connectDB = require('./config/mongodb');
const express = require("express");


const app = express()
app.use(express.json());
connectDB();

app.use("/wel", require("./homeRoute/welcome"))

const PORT = process.env.PORT || 5000;

console.log("Server file executed");
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})
