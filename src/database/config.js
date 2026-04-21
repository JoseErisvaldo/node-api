import dotenv from "dotenv";

dotenv.config();

const dbSSL = process.env.DB_SSL === "true";
const dbSSLRejectUnauthorized =
  process.env.DB_SSL_REJECT_UNAUTHORIZED === "true";

const dialectOptions = dbSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: dbSSLRejectUnauthorized,
      },
    }
  : {};

export default {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "finance_api",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions,
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "finance_api_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions,
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "finance_api",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions,
  },
};
