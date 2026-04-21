import { models } from "../../database/index.js";
import { Op } from "sequelize";

export default class TransactionRepository {
  static async create(transaction) {
    return models.Transaction.create(transaction);
  }

  static async findAllByUser(userId) {
    return models.Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  static async findAllByUserWithFilters(userId, filters, pagination) {
    const { startDate, endDate, search, type, category } = filters;
    const { limit, offset } = pagination;

    const where = {
      userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    return models.Transaction.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  static async findByIdAndUser(id, userId) {
    return models.Transaction.findOne({
      where: { id, userId },
    });
  }

  static async update(transaction, values) {
    return transaction.update(values);
  }

  static async delete(transaction) {
    return transaction.destroy();
  }
}
