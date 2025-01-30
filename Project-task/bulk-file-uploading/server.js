const express = require("express");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileroutes");
const sequelize = require("./config/dbconnection");

dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", fileRoutes);

// Connect to Database
sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
