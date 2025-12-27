const mongoose = require('mongoose');

const profileWithEmailSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
       name: { type: String, required: true },
       phone: { type: String },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('ProfileWithEmail', profileWithEmailSchema);