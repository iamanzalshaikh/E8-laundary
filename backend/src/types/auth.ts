// import { Request } from "express";
import type { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  role?: "client" | "admin";
}

export interface UserTokenPayload {
  userId: string;
  role: "client" | "admin";
}
