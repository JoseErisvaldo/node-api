import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js";
import UserModel from "./models/user.js";
import TransactionModel from "./models/transaction.js";
import StripeProductModel from "./models/stripeProduct.js";
import StripePriceModel from "./models/stripePrice.js";
import StripeSubscriptionModel from "./models/stripeSubscription.js";

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: false,
  },
);

const models = {
  User: UserModel.init(sequelize),
  Transaction: TransactionModel.init(sequelize),
  StripeProduct: StripeProductModel.init(sequelize),
  StripePrice: StripePriceModel.init(sequelize),
  StripeSubscription: StripeSubscriptionModel.init(sequelize),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize, models };
