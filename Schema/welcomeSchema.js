const mongoose = require("mongoose")

const topbar = new mongoose.Schema(
    {
        welcome: String
    })

module.exports = mongoose.model("welcomepage",topbar)