const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/database"); 
const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api", messageRoutes);

io.on("connection", (socket) => {
    console.log("A user connected");

    // Fetch chat history
    Message.findAll({ order: [["timestamps", "ASC"]], limit: 50 })
        .then(messages => socket.emit("chatHistory", messages));

    // Handle new user joining
    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    // Handle new chat messages
    socket.on("chat", async (message) => {
        try {
            const savedMessage = await Message.create({
                userId: message.userId, 
                text: message.text
            });
            io.emit("chat", savedMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Handle user leaving
    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} left the conversation`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Sync database and start server
sequelize.sync().then(() => {
    server.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});