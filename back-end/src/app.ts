import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import appRoutes from "./routes/index";
import swaggerSpec from "./swagger/swaggerConfig";
import rateLimit from "express-rate-limit";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Set up rate limiting: 200 requests per minute per client (IP)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
  statusCode: 429,
  headers: true,
});

// Apply rate limiting globally for all routes
app.use(limiter);

/**
 * App routes.
 */
app.use("/events", appRoutes.eventsRoutes);
app.get("/", (req, res) => {
  res.send("Hello, SuperDev");
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
