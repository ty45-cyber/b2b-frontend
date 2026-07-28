import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. MUST BE FIRST: Global CORS Configuration
app.use(
  cors({
    origin: "*", // Allows requests from Vercel
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Body Parser
app.use(express.json());

// 3. Simple Health Check Endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// 4. Import & Register Routes
// import negotiateRouter from "./routes/negotiate";
// app.use("/api/negotiate", negotiateRouter);

// 5. Global Error Handler (Prevents crashes from stripping CORS headers)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Backend Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred on the server.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});