import { models } from "../../database/index.js";

export default class UserRepository {
  static async findByEmail(email) {
    return models.User.findOne({ where: { email } });
  }

  static async findAuthById(id) {
    return models.User.findByPk(id);
  }

  static async findByStripeCustomerId(stripeCustomerId) {
    return models.User.findOne({ where: { stripeCustomerId } });
  }

  static async findById(id) {
    return models.User.findByPk(id, {
      attributes: ["id", "name", "email", "createdAt"],
    });
  }

  static async findBillingById(id) {
    return models.User.findByPk(id, {
      attributes: ["id", "email", "stripeCustomerId"],
    });
  }

  static async createUser({ name, email, password }) {
    return models.User.create({ name, email, password });
  }

  static async updateRefreshToken(
    userId,
    refreshTokenHash,
    refreshTokenExpiresAt,
  ) {
    await models.User.update(
      { refreshTokenHash, refreshTokenExpiresAt },
      { where: { id: userId } },
    );
  }

  static async updateStripeBilling(userId, values) {
    await models.User.update(values, { where: { id: userId } });
  }
}
