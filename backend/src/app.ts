import express from "express";
import cors from "cors";
import pool from "./config/db";
import authRoutes from "./routes/authRoutes";
import urlRoutes from "./routes/urlRoutes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/qr",
  express.static(path.join(__dirname, "../public/qr"))
);
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

app.get("/", (req, res) => {
  res.send("Smart URL Management API is running 🚀");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error,
    });
  }
});

export default app;