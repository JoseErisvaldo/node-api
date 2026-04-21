import { Router } from "express";
import userRoutes from "../modules/users/routes.js";
import transactionRoutes from "../modules/transactions/routes.js";
import billingRoutes from "../modules/billing/routes.js";
import BillingController from "../modules/billing/controller.js";
import UserController from "../modules/users/controller.js";
import validate from "../middlewares/validate.js";
import { loginSchema, refreshTokenSchema } from "../utils/validators.js";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Faz login e retorna access token e refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Autenticação bem sucedida
 */
router.post("/auth/login", validate(loginSchema), UserController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Users
 *     summary: Renova o access token usando o refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Tokens renovados com sucesso
 */
router.post(
  "/auth/refresh",
  validate(refreshTokenSchema),
  UserController.refresh,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Invalida o refresh token atual
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post(
  "/auth/logout",
  validate(refreshTokenSchema),
  UserController.logout,
);

/**
 * @swagger
 * /api/webhooks/stripe:
 *   post:
 *     tags: [Billing]
 *     summary: Endpoint dedicado para webhooks Stripe
 *     description: Alias para recebimento de eventos Stripe.
 *     responses:
 *       200:
 *         description: Evento recebido
 */
router.post("/webhooks/stripe", BillingController.webhook);

router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/billing", billingRoutes);

export default router;
