import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { issuesService } from "./issues.service";
import type {
  ICreateIssuePayload,
  IIssueQueryParams,
  IUpdateIssuePayload,
} from "./issues.interface";
import sendResponse from "../../utility/sendResponse";

// POST /api/issues 
const createIssue = async (req: Request, res: Response): Promise<void> => {
  try {
   
    const reporterId = req.user!.id;
    const payload = req.body as ICreateIssuePayload;

    const result = await issuesService.createIssueIntoDB(payload, reporterId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
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

// GET /api/issues 
const getAllIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as IIssueQueryParams;
    const result = await issuesService.getAllIssuesFromDB(query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
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

// GET /api/issues/:id 
const getSingleIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
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

// PATCH /api/issues/:id 
const updateIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payload = req.body as IUpdateIssuePayload;
    const requesterId = req.user!.id;
    const requesterRole = req.user!.role;

    const result = await issuesService.updateIssueInDB(
      id as string,
      payload,
      requesterId,
      requesterRole
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
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

// DELETE /api/issues/:id 
const deleteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await issuesService.deleteIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully",
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

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
