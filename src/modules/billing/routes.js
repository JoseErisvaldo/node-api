import { Router } from "express";
import BillingController from "./controller.js";
import validate from "../../middlewares/validate.js";
import authMiddleware from "../../middlewares/auth.js";
import {
  createCheckoutSchema,
  createPortalSchema,
} from "../../utils/validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Integração com Stripe Checkout, Portal e Webhook
 */

/**
 * @swagger
 * /api/billing/catalog/products:
 *   get:
 *     tags: [Billing]
 *     summary: Lista produtos ativos sincronizados do Stripe
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
 */
router.get("/catalog/products", BillingController.listProducts);

/**
 * @swagger
 * /api/billing/catalog/prices:
 *   get:
 *     tags: [Billing]
 *     summary: Lista preços sincronizados do Stripe
 *     parameters:
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: productId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Preços retornados com sucesso
 */
router.get("/catalog/prices", BillingController.listPrices);

/**
 * @swagger
 * /api/billing/subscriptions/me:
 *   get:
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     summary: Retorna a assinatura mais recente do usuário autenticado
 *     responses:
 *       200:
 *         description: Assinatura retornada com sucesso
 */
router.get(
  "/subscriptions/me",
  authMiddleware,
  BillingController.mySubscription,
);

/**
 * @swagger
 * /api/billing/checkout/session:
 *   post:
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     summary: Cria sessão do Stripe Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lookupKey
 *             properties:
 *               lookupKey:
 *                 type: string
 *                 example: basic_plan_monthly
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *               mode:
 *                 type: string
 *                 enum: [subscription, payment]
 *                 default: subscription
 *               successUrl:
 *                 type: string
 *                 format: uri
 *               cancelUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 */
router.post(
  "/checkout/session",
  authMiddleware,
  validate(createCheckoutSchema),
  BillingController.createCheckoutSession,
);

/**
 * @swagger
 * /api/billing/portal/session:
 *   post:
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     summary: Cria sessão do Stripe Customer Portal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               session_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sessão do portal criada com sucesso
 */
router.post(
  "/portal/session",
  authMiddleware,
  validate(createPortalSchema),
  BillingController.createPortalSession,
);

export default router;
