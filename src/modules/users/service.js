import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserRepository from "./repository.js";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "supersecretrefreshtokenkey";
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateAccessToken(userId) {
  return jwt.sign({ userId, tokenType: "access" }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId, tokenType: "refresh" }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

async function issueTokens(user) {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const decodedRefreshToken = jwt.decode(refreshToken);
  const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

  await UserRepository.updateRefreshToken(
    user.id,
    hashToken(refreshToken),
    refreshTokenExpiresAt,
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    refreshExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  };
}

export default class UserService {
  static async registerUser(data) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error("Email já está em uso");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  static async login(credentials) {
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isValidPassword) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    const tokens = await issueTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async refreshToken(refreshToken) {
    let payload;

    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch {
      const error = new Error("Refresh token inválido ou expirado");
      error.status = 401;
      throw error;
    }

    if (payload.tokenType !== "refresh") {
      const error = new Error("Tipo de token inválido");
      error.status = 401;
      throw error;
    }

    const targetUser = await UserRepository.findAuthById(payload.userId);

    if (!targetUser || !targetUser.refreshTokenHash) {
      const error = new Error("Sessão inválida");
      error.status = 401;
      throw error;
    }

    if (targetUser.refreshTokenHash !== hashToken(refreshToken)) {
      const error = new Error("Refresh token não reconhecido");
      error.status = 401;
      throw error;
    }

    if (
      targetUser.refreshTokenExpiresAt &&
      new Date(targetUser.refreshTokenExpiresAt) <= new Date()
    ) {
      await UserRepository.updateRefreshToken(targetUser.id, null, null);
      const error = new Error("Refresh token expirado");
      error.status = 401;
      throw error;
    }

    const tokens = await issueTokens(targetUser);

    return {
      ...tokens,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
      },
    };
  }

  static async logout(refreshToken) {
    let payload;

    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch {
      const error = new Error("Refresh token inválido ou expirado");
      error.status = 401;
      throw error;
    }

    if (payload.tokenType !== "refresh") {
      const error = new Error("Tipo de token inválido");
      error.status = 401;
      throw error;
    }

    const user = await UserRepository.findAuthById(payload.userId);
    if (user?.refreshTokenHash === hashToken(refreshToken)) {
      await UserRepository.updateRefreshToken(user.id, null, null);
    }

    return { message: "Logout realizado com sucesso" };
  }

  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.status = 404;
      throw error;
    }
    return user;
  }
}
