require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const { attachUser } = require("./middlewares/authenticate");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors({
  origin: "http://localhost:5173",   // React dev server
  credentials: true,                 // allow cookies cross-origin
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));


// Static files
//allow frontend to access backend static image url 
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
}, express.static(path.resolve("./public/uploads")));
//for profile pic
app.use("/images", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
}, express.static(path.resolve("./public/images")));


//Parsers 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth (attach req.user on every request) 
app.use(attachUser);


//API Routes 
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

// Global error handler 
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

// Start 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
