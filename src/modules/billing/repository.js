import { models } from "../../database/index.js";

export default class BillingRepository {
  static async upsertProduct(productData) {
    await models.StripeProduct.upsert(productData);
  }

  static async deleteProduct(productId) {
    await models.StripeProduct.destroy({ where: { id: productId } });
  }

  static async upsertPrice(priceData) {
    await models.StripePrice.upsert(priceData);
  }

  static async deletePrice(priceId) {
    await models.StripePrice.destroy({ where: { id: priceId } });
  }

  static async upsertSubscription(subscriptionData) {
    await models.StripeSubscription.upsert(subscriptionData);
  }

  static async listActiveProductsWithPrices() {
    return models.StripeProduct.findAll({
      where: { active: true },
      include: [
        {
          model: models.StripePrice,
          as: "prices",
          where: { active: true },
          required: false,
        },
      ],
      order: [
        ["name", "ASC"],
        [{ model: models.StripePrice, as: "prices" }, "unitAmount", "ASC"],
      ],
    });
  }

  static async listPrices({ active = true, productId = null } = {}) {
    const where = {};

    if (active !== undefined && active !== null) {
      where.active = active;
    }

    if (productId) {
      where.productId = productId;
    }

    return models.StripePrice.findAll({
      where,
      include: [
        {
          model: models.StripeProduct,
          as: "product",
          required: false,
        },
      ],
      order: [["unitAmount", "ASC"]],
    });
  }

  static async findLatestSubscriptionByUserId(userId) {
    return models.StripeSubscription.findOne({
      where: { userId },
      include: [
        {
          model: models.StripePrice,
          as: "price",
          required: false,
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
  }
}
