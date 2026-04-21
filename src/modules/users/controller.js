import UserService from "./service.js";
import { successResponse } from "../../utils/response.js";

export default class UserController {
  static async register(req, res, next) {
    try {
      const user = await UserService.registerUser(req.body);
      return res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const auth = await UserService.login(req.body);
      return res.status(200).json(successResponse(auth));
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const auth = await UserService.refreshToken(req.body.refreshToken);
      return res.status(200).json(successResponse(auth));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const result = await UserService.logout(req.body.refreshToken);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id);
      return res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }
}
