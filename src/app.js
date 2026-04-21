import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import swaggerConfig from "./config/swagger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

const corsEnabled = process.env.CORS_ENABLED !== "false";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
if (corsEnabled) {
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
}

// Stripe webhook requires the raw request body to validate signature.
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swaggerConfig);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finance API is running. Access /docs for Swagger.",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
