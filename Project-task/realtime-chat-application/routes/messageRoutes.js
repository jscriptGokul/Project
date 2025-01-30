const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User"); 
const { validateMessage } = require("../validators/messageValidator");
const app = express();

// Fetch messages
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.findAll({
            order: [["timestamp", "DESC"]],
            limit: 50,
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new message
app.post("/messages", async (req, res) => {
    try {
        // Validate the request body
        const { error } = validateMessage(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Check if the user exists
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Create the message
        const message = await Message.create({
            text: req.body.text,
            username: user.username,
            userId: user.id, 
        });

        // Return the created message with a 201 status
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
