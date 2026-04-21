import { Router } from "express";
import UserController from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { registerSchema } from "../../utils/validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de usuários e autenticação
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/", validate(registerSchema), UserController.register);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Retorna informações do usuário autenticado
 *     responses:
 *       200:
 *         description: Perfil do usuário
 */
router.get("/me", authMiddleware, UserController.profile);

export default router;
