import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const createCheckoutSchema = Joi.object({
  lookupKey: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).default(1),
  mode: Joi.string().valid("subscription", "payment").default("subscription"),
  successUrl: Joi.string().uri().optional(),
  cancelUrl: Joi.string().uri().optional(),
});

export const createPortalSchema = Joi.object({
  sessionId: Joi.string().optional(),
  session_id: Joi.string().optional(),
});

export const transactionSchema = Joi.object({
  title: Joi.string().trim().min(2).required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().trim().min(2).required(),
});

export const transactionListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  search: Joi.string().trim().min(1).optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().trim().min(1).optional(),
});
