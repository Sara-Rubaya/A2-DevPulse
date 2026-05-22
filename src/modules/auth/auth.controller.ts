import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const signup = async (req: Request, res: Response): Promise<void> => {
  try {

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