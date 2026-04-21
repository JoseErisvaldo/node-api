import { Router } from "express";
import TransactionController from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { transactionSchema } from "../../utils/validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gerenciamento de transações financeiras
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     summary: Cria uma nova transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - category
 *     responses:
 *       201:
 *         description: Transação criada
 */
router.post(
  "/",
  authMiddleware,
  validate(transactionSchema),
  TransactionController.create,
);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     summary: Lista transações do usuário autenticado
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial do filtro (between)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final do filtro (between)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Busca parcial por título
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista paginada de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [income, expense]
 *                           category:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 42
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get("/", authMiddleware, TransactionController.list);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza uma transação existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação atualizada
 */
router.put(
  "/:id",
  authMiddleware,
  validate(transactionSchema),
  TransactionController.update,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     summary: Remove uma transação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transação removida
 */
router.delete("/:id", authMiddleware, TransactionController.remove);

export default router;
