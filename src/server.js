import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { sequelize } from "./database/index.js";

dotenv.config();

const PORT = process.env.PORT || 3333;
const server = http.createServer(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado com sucesso");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error("Falha ao conectar ao banco de dados:", error.message);
    process.exit(1);
  }
}

startServer();
