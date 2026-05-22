import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utility/sendResponse";
import type { ILoginPayload, IRegisterPayload } from "./auth.interface";
import { authService } from "./auth.service";

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body as IRegisterPayload;
    const newUser = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    sendResponse(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body as ILoginPayload;
    const result = await authService.loginUserIntoDB(payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    sendResponse(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const authController = {
  signup,
  login,
};
