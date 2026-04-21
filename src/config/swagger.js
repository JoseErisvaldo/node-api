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
        url: "http://localhost:3333",
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
