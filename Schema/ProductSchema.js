const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    Prodtname: { type: String, required: true, unique: true },
    Prodtdescription: { type: String, required: true },
    Prodtprice: { type: Number, required: true },
    Prodtcategory: { type: String, required: true },
    ProdtstockQuantity: { type: Number, default: 0 },
    QuantitySold : {type: Number, default: 0},
    bestsellerQuantity : {type: Number, default: 0},

    Productimg: {
        type: [String],
        required: true,
        validate: {
            validator: function(val) {
                return val.length <= 5; 
            },
            message: 'You can upload a maximum of 5 images.'
        }
    },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;