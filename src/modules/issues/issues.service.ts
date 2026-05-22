import { StatusCodes } from "http-status-codes";
import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  
} from "./issues.interface";

─────────────
const attachReporter = async (issue: IIssueRow): Promise<IIssueWithReporter> => {
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  const reporter = reporterResult.rows[0] as {
    id: number;
    name: string;
    role: string;
  } | undefined;

 
  const { reporter_id, ...issueWithoutReporterId } = issue;
  void reporter_id; 

  return {
    ...issueWithoutReporterId,
    reporter: reporter ?? { id: 0, name: "Unknown", role: "contributor" },
  };
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
const createIssueIntoDB = async (
  payload: ICreateIssuePayload,
  reporterId: number
): Promise<IIssueRow> => {
  const { title, description, type } = payload;

  // Validate required fields
  if (!title || !description || !type) {
    const error = new Error("Title, description and type are required.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

 
  if (title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

 
  if (description.length < 20) {
    const error = new Error("Description must be at least 20 characters.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  // Validate type
  if (!["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  
  const userCheck = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [reporterId]
  );
  if (userCheck.rows.length === 0) {
    const error = new Error("Reporter user not found.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId]
  );

  return result.rows[0] as IIssueRow;
};

// ─── GET ALL — with sort, type, status filters ────────────────────────────────
const getAllIssuesFromDB = async (
  query: IIssueQueryParams
): Promise<IIssueWithReporter[]> => {
  const { sort = "newest", type, status } = query;

  // Build dynamic WHERE clause safely
  const conditions: string[] = [];
  const values: string[] = [];
  let paramIndex = 1;

  if (type) {
    conditions.push(`type = $${paramIndex}`);
    values.push(type);
    paramIndex++;
  }

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Sort direction
  const orderDir = sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ORDER BY created_at ${orderDir}`,
    values
  );

  const issues = result.rows as IIssueRow[];

  // Collect all unique reporter_ids — batch fetch to avoid N+1 per hint
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  if (reporterIds.length === 0) return [];

  // Batch fetch reporters with WHERE id IN (...)
  const placeholders = reporterIds.map((_, i) => `$${i + 1}`).join(", ");
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );

  // Map reporters by id for O(1) lookup
  const reporterMap = new Map<number, { id: number; name: string; role: string }>();
  for (const row of reportersResult.rows as { id: number; name: string; role: string }[]) {
    reporterMap.set(row.id, row);
  }

  // Attach reporter to each issue
  return issues.map((issue) => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporterMap.get(reporter_id) ?? {
        id: reporter_id,
        name: "Unknown",
        role: "contributor",
      },
    };
  });
};



export const issuesService = {
  createIssueIntoDB,
  
};
