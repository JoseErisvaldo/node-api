import TransactionService from "./service.js";
import { successResponse } from "../../utils/response.js";
import { transactionListQuerySchema } from "../../utils/validators.js";

export default class TransactionController {
  static async create(req, res, next) {
    try {
      const transaction = await TransactionService.createTransaction(
        req.user.id,
        req.body,
      );
      return res.status(201).json(successResponse(transaction));
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { error, value } = transactionListQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const validationError = new Error("Parâmetros de consulta inválidos");
        validationError.status = 400;
        validationError.details = error.details.map((detail) => detail.message);
        throw validationError;
      }

      const transactions = await TransactionService.listTransactions(
        req.user.id,
        value,
      );
      return res.json(successResponse(transactions));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const transaction = await TransactionService.updateTransaction(
        req.user.id,
        req.params.id,
        req.body,
      );
      return res.json(successResponse(transaction));
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const result = await TransactionService.deleteTransaction(
        req.user.id,
        req.params.id,
      );
      return res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}
