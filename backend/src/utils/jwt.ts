

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";

const ACCESS_EXPIRES_IN = "7d";
const REFRESH_EXPIRES_IN = "30d";
    
// ============================================
// TYPES
// ============================================

export interface UserTokenPayload extends JwtPayload {
  userId: string;
  role: "client" | "admin";
}

// ============================================
// SIGN TOKENS
// ============================================

export function signUserAccessToken(userId: string, role: "client" | "admin"): string {
  const payload: UserTokenPayload = { userId, role };

  return jwt.sign(payload, config.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

export function signUserRefreshToken(userId: string, role: "client" | "admin"): string {
  const payload: UserTokenPayload = { userId, role };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

// ============================================
// VERIFY TOKENS
// ============================================

export function verifyUserAccessToken(
  token: string,
): UserTokenPayload | null {
  try {
    return jwt.verify(
      token,
      config.JWT_ACCESS_SECRET!,
    ) as UserTokenPayload;
  } catch {
    return null;
  }
}

export function verifyUserRefreshToken(
  token: string,
): UserTokenPayload | null {
  try {
    return jwt.verify(
      token,
      config.JWT_REFRESH_SECRET!,
    ) as UserTokenPayload;
  } catch {
    return null;
  }
}
