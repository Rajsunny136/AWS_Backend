const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController");
const {
    createUser,
    getUserById,
    getAllUsers,
    updateUser
} = require("../controllers/userController");

const router = express.Router();

// OTP Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// User Routes
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);

module.exports = router;
