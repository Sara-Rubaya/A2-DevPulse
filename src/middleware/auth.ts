import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { pool } from "../db";
import type { TRole } from "../types";


const auth = (...roles: TRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

     
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized! No token provided.",
        });
        return;
      }

     
      const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload & {
        id: number;
        name: string;
        role: string;
      };

     
      const userData = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [decoded.id]
      );
      
    const user = userData.rows[0];

      if (userData.rows.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

     

     
      if (roles.length && !roles.includes(user.role )) {
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
        return;
      }

    
      req.user = decoded
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
