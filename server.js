const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*" }
});

socketHandler(io);

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const existing = await User.findOne({ email: "admin@test.com" });

  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashed,
      role: "admin"
    });

    console.log("Admin created successfully");
  }
}

createAdmin();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server running on port", PORT));