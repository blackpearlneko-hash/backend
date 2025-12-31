const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const pd = require("../Schema/ProductSchema");
require("dotenv").config();

// --- 1. Configure Cloudinary ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- 2. Configure Storage Engine ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "BlackPearl_Products", // Folder name in your Cloudinary console
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Restrict file types
    },
});
console.log("cloudinary connected")

const upload = multer({ storage: storage });

// --- 3. POST Route (Supports up to 5 images) ---
router.post("/productdet", upload.array("image", 5), async (req, res) => {
    try {
        // Validation: Ensure files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        const {
            prodid,
            Prodtname,
            Prodtdescription,
            Prodtprice,
            Prodtcategory,
            ProdtstockQuantity,
        } = req.body;

        // --- MAP CLOUDINARY URLS ---
        // Cloudinary puts the public URL in `file.path`
        const imagePaths = req.files.map(file => file.path);

        const newProdt = new pd({
            prodid,
            Prodtname,
            Prodtdescription,
            Prodtprice,
            Prodtcategory,
            ProdtstockQuantity,
            Productimg: imagePaths,
        });

        await newProdt.save();
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newProdt
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 4. DELETE Route (Optional: Also delete from Cloudinary) ---
router.delete('/productdet/:Prodtname', async (req, res) => {
    try {
        // Find the product first to get the image URLs
        const product = await pd.findOne({ Prodtname: req.params.Prodtname });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Optional: Delete images from Cloudinary loop
        // (You need to extract the "public_id" from the URL to do this,
        //  but for now, just deleting from DB is safer for beginners).

        await pd.deleteOne({ Prodtname: req.params.Prodtname });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// --- 5. GET Routes (Unchanged) ---
router.get("/productdet", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        console.log("Fetching products for page:", page);

        const products = await pd
            .find(
                {},
                {
                    Prodtname: 1,
                    Prodtprice: 1,
                    Productimg: { $slice: 1 } // ✅ FIXED
                }
            )
            .skip(skip)
            .limit(limit)
            .lean();
            console.log("Products fetched:", products.length);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



router.get("/productdetail", async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        const product = await pd.findOne(
            { Prodtname: name },
            {
                Prodtname: 1,
                Prodtprice: 1,
                Prodtdescription: 1,
                Productimg: 1
            }
        ).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


router.get("/bestproduct", async (req, res) => {
    try {
        const products = await pd
            .find()
            .sort({ bestsellerQuantity: -1 }) 
            .limit(6);                         

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;