const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const ProfileWithEmail = require("../Schema/profilewithemailSchema");
const authMiddleware = require("../middleware/funauthmiddle");

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log("Received ID Token:", idToken);

    if (!idToken) {
      console.error("ID token is missing in the request body");
      return res.status(400).json({ message: "ID token missing" });
    }
console.log("Verifying ID Token with Google...");
    // 1️⃣ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID
    });
    console.log("verified i guess");

    const payload = ticket.getPayload();
    console.log("payload success ");
    const { email, name } = payload;
    console.log("email and name received");

    // 2️⃣ Check if user already exists
    let profile = await ProfileWithEmail.findOne({ email });
    console.log("Checking if user exists in DB...");

    if (!profile) {
      console.log("Creating new user profile...");
      // 🔹 Create new user
      profile = await ProfileWithEmail.create({
        email,
        name,
      });
    }



    // 3️⃣ Create JWT
    console.log("Creating JWT...");
    const token = jwt.sign(
      { userId: profile._id, email: profile.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    console.log("JWT created successfully");

    res.cookie("token", token, {
      httpOnly: true,
      secure:  true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // 4️⃣ ALWAYS return name & email (existing OR new)
    res.status(200).json({
      success: true,
      user: {
        name: profile.name,
        email: profile.email,
      },
    });
    console.log("http only cookie set: response sent");
    console.log("Response sent successfully");

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});


router.get("/me", authMiddleware,async (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully" });
});

 

module.exports = router;
