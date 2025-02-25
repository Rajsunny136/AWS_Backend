const axios = require("axios");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const APP_ID = process.env.APP_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const service_id = 1;

if (!CLIENT_ID || !CLIENT_SECRET || !APP_ID || !JWT_SECRET) {
  throw new Error("Environment variables are missing.");
}

// Send OTP
const sendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const sanitizedPhone = phone.replace(/\D/g, "");
  if (sanitizedPhone.length < 10 || sanitizedPhone.length > 15) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const existingUser = await User.findOne({
    where: {
      phone: sanitizedPhone,
      active: true,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ error: "User is inactive" });
  }

  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber: `91${sanitizedPhone}`,
        otpLength: 4,
        channel: "WHATSAPP",
        expiry: 600,
      },
      {
        headers: {
          "Content-Type": "application/json",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          appId: APP_ID,
        },
      }
    );

    console.log("OTP send response:", response.data);

    if (response.data.orderId) {
      res.json({ message: "OTP sent successfully", orderId: response.data.orderId });
    } else {
      throw new Error(`Failed to send OTP: ${response.data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: `Failed to send OTP: ${error.response?.data?.message || error.message}`,
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { phone, otp, orderId } = req.body;

  if (!phone || !otp || !orderId) {
    return res.status(400).json({ error: "Phone number, OTP, and orderId are required" });
  }

  const sanitizedPhone = phone.replace(/\D/g, "");
  if (sanitizedPhone.length < 10 || sanitizedPhone.length > 15) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/verify",
      {
        phoneNumber: `91${sanitizedPhone}`,
        otp,
        orderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          appId: APP_ID,
        },
      }
    );

    console.log("OTP verify response:", response.data);

    if (response.data.isOTPVerified) {
      const user = await User.findOne({ where: { phone: sanitizedPhone } });

      if (user) {
        const token = jwt.sign(
          { id: user.id, phone: sanitizedPhone, name: user.username, service_id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );
        console.log("JWT Token:", token);

        res.json({ message: "OTP Verified Successfully!", token });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid OTP or phone number" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: `Failed to verify OTP: ${error.response?.data?.message || error.message}`,
    });
  }
};

module.exports = { sendOTP, verifyOTP };
