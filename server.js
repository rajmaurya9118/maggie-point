const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

// Models
const User = require("./models/user");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Check logged-in user
app.use(async (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(decoded.userid).lean();
      req.user = user;
      res.locals.loggedIn = true;
      res.locals.user = user;
    } catch {
      req.user = null;
      res.locals.loggedIn = false;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.loggedIn = false;
    res.locals.user = null;
  }
  next();
});

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("⛔ DB connection error:", err.message));

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/order")(io)); // pass io
app.use("/admin", require("./routes/admin")(io));
app.use("/", require("./routes/cart"));

// Socket.IO
io.on("connection", socket => {
  console.log("🔗 New client connected", socket.id);
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
