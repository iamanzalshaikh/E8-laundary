

// import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
// import { AuthRequest } from "../types/auth.types.js";
import { verifyUserAccessToken, type UserTokenPayload } from "../utils/jwt.js";
import type { AuthRequest } from "../types/auth.js";
import type { NextFunction, Response } from "express";
// import { UserTokenPayload } from "../utils/jwt.js";
// import { verifyUserAccessToken } from "../utils/jwtService.js";

const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
      return;
    }

    logger.info(`Token received: ${token.substring(0, 30)}...`);



    const decoded = verifyUserAccessToken(token) as UserTokenPayload;
    if (!decoded || !decoded.userId) {
      logger.error("Token decoded but no userId found");
      res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
      return;
    }

    logger.info(`User authenticated: ${decoded.userId} (${decoded.role})`);
    
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error: any) {
    logger.error(`Auth Error: ${error.message}`);
    res.status(401).json({ 
      success: false,
      message: "Authentication failed",
      error: error.message
    });
    return;
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
    return;
  }
  next();
};

export default isAuth;
