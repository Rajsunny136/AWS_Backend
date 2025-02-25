const User = require("../models/userModel");

// Create a new user
const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, gender, password, fcm_token } = req.body;

        if (!firstname || !lastname || !email || !phone || !password) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const username = `${firstname} ${lastname}`;

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (!/^\d+$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format." });
        }

        if (gender && !["M", "F", "Other"].includes(gender)) {
            return res.status(400).json({ message: "Invalid gender value." });
        }

        const existingUser = await User.findOne({ where: { email, is_deleted: false } });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const createUserObject = { username, email, phone, gender, password, fcm_token };
        const newUser = await User.create(createUserObject);

        return res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (error) {
        console.error("Error in creating user:", error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { is_deleted: false } });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, gender } = req.body;

        const user = await User.findOne({ where: { id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await User.update({ username, email, phone, gender }, { where: { id } });

        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Export functions (CommonJS)
module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
};
