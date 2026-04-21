import dotenv from "dotenv";

dotenv.config();

const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL ||
  process.env.API_PUBLIC_URL ||
  "http://localhost:3333";

const swaggerConfig = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description:
        "API REST para gestão de finanças pessoais com Node.js, Sequelize e PostgreSQL",
    },
    servers: [
      {
        url: swaggerServerUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.js", "./src/routes/index.js"],
};

export default swaggerConfig;
