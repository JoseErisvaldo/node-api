import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST || "localhost";
const isLocalDatabase = ["localhost", "127.0.0.1"].includes(dbHost);
const dbSSL = !isLocalDatabase;
const dbSSLRejectUnauthorized = false;

const databaseConfig = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "finance_api",
  host: dbHost,
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
  dialectOptions: dbSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: dbSSLRejectUnauthorized,
        },
      }
    : {},
};

export default databaseConfig;
