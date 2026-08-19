// server.js
// VerifyKaro backend entry point.

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const emailVerificationRoutes = require("./routes/emailVerificationRoutes");

const verifyRoute = require("./routes/verify");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server tools and local requests without an Origin
      // header. Browser requests must match CLIENT_ORIGIN.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin is not allowed.")
      );
    },
  })
);

app.use(express.json({ limit: "64kb" }));

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many checks from this device. Please wait a few minutes and try again.",
  },
});

app.get("/", (req, res) => {
  res.send("VerifyKaro backend is running.");
});

app.use("/api", verifyLimiter, verifyRoute);
app.use("/api", emailVerificationRoutes);

app.listen(PORT, () => {
  console.log(`VerifyKaro server running on http://localhost:${PORT}`);
});
