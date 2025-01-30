require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// Register a new user
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, password: hashedPassword });


        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  User login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Fetch user from DB
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials (user not found)" });
        }


        // Ensure password comparison works
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials (wrong password)" });
        }

        //  Generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = app;
