import TransactionRepository from "./repository.js";

export default class TransactionService {
  static async createTransaction(userId, payload) {
    return TransactionRepository.create({ ...payload, userId });
  }

  static async listTransactions(userId, query) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      search,
      type,
      category,
    } = query;

    const start = TransactionService.normalizeStartDate(startDate);
    const end = TransactionService.normalizeEndDate(endDate);

    if (start > end) {
      const error = new Error(
        "A data inicial não pode ser maior que a data final",
      );
      error.status = 400;
      throw error;
    }

    const offset = (page - 1) * limit;

    const { rows, count } =
      await TransactionRepository.findAllByUserWithFilters(
        userId,
        {
          startDate: start,
          endDate: end,
          search,
          type,
          category,
        },
        {
          limit,
          offset,
        },
      );

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      items: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  static normalizeStartDate(value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00.000Z`);
    }
    return new Date(value);
  }

  static normalizeEndDate(value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T23:59:59.999Z`);
    }
    return new Date(value);
  }

  static async updateTransaction(userId, transactionId, payload) {
    const transaction = await TransactionRepository.findByIdAndUser(
      transactionId,
      userId,
    );
    if (!transaction) {
      const error = new Error("Transação não encontrada");
      error.status = 404;
      throw error;
    }
    return TransactionRepository.update(transaction, payload);
  }

  static async deleteTransaction(userId, transactionId) {
    const transaction = await TransactionRepository.findByIdAndUser(
      transactionId,
      userId,
    );
    if (!transaction) {
      const error = new Error("Transação não encontrada");
      error.status = 404;
      throw error;
    }
    await TransactionRepository.delete(transaction);
    return { message: "Transação removida com sucesso" };
  }
}
