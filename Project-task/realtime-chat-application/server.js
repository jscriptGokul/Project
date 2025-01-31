const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const sequelize = require("./config/database");
const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api", messageRoutes);

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("A user connected");

    // Fetch chat history
    Message.findAll({ order: [["createdAt", "ASC"]], limit: 50 })
        .then(messages => ws.send(JSON.stringify({ type: "chatHistory", data: messages })));

    // Handle new user joining
    ws.on("message", (messageData) => {
        const message = JSON.parse(messageData);

        // New user joining
        if (message.type === "newuser") {
            const { username } = message;
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", message: `${username} joined the conversation` }));
                }
            });
        }

        // Handle chat message
        if (message.type === "chat") {
            const { userId, text } = message;
            Message.create({
                userId: userId,
                text: text
            })
            .then((savedMessage) => {
                // Broadcast chat message to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "chat", data: savedMessage }));
                    }
                });
            })
            .catch((error) => {
                console.error("Error saving message:", error);
            });
        }

        // User leaving
        if (message.type === "exituser") {
            const { username } = message;
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", message: `${username} left the conversation` }));
                }
            });
        }
    });

    // Handle WebSocket disconnect
    ws.on("close", () => {
        console.log("User disconnected");
    });
});

// Sync database and start server
sequelize.sync().then(() => {
    server.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});
