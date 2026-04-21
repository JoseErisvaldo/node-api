import BillingService from "./service.js";
import { successResponse } from "../../utils/response.js";

export default class BillingController {
  static async listProducts(req, res, next) {
    try {
      const products = await BillingService.listProducts();
      return res.status(200).json(successResponse(products));
    } catch (error) {
      next(error);
    }
  }

  static async listPrices(req, res, next) {
    try {
      const active =
        req.query.active === undefined ? true : req.query.active === "true";
      const productId = req.query.productId || null;

      const prices = await BillingService.listPrices({ active, productId });
      return res.status(200).json(successResponse(prices));
    } catch (error) {
      next(error);
    }
  }

  static async mySubscription(req, res, next) {
    try {
      const subscription = await BillingService.getMySubscription(req.user.id);
      return res.status(200).json(successResponse(subscription));
    } catch (error) {
      next(error);
    }
  }

  static async createCheckoutSession(req, res, next) {
    try {
      const session = await BillingService.createCheckoutSession(
        req.body,
        req.user.id,
      );
      return res.status(201).json(successResponse(session));
    } catch (error) {
      next(error);
    }
  }

  static async createPortalSession(req, res, next) {
    try {
      const sessionId = req.body.sessionId || req.body.session_id;
      const portal = await BillingService.createPortalSession(
        sessionId,
        req.user.id,
      );
      return res.status(201).json(successResponse(portal));
    } catch (error) {
      next(error);
    }
  }

  static async webhook(req, res, next) {
    try {
      const signature = req.headers["stripe-signature"];
      const result = await BillingService.handleWebhook(req.body, signature);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
