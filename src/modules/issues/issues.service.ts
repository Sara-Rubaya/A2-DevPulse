import { StatusCodes } from "http-status-codes";
import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  IIssueQueryParams,
  IIssueRow,
  IIssueWithReporter,
  IUpdateIssuePayload,
} from "./issues.interface";

// ─── Helper: attach reporter to a single issue (no JOIN per spec) ─────────────
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

// GET ALL 
const getAllIssuesFromDB = async (
  query: IIssueQueryParams
): Promise<IIssueWithReporter[]> => {
  const { sort = "newest", type, status } = query;


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


  const orderDir = sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ORDER BY created_at ${orderDir}`,
    values
  );

  const issues = result.rows as IIssueRow[];

 
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  if (reporterIds.length === 0) return [];

 
  const placeholders = reporterIds.map((_, i) => `$${i + 1}`).join(", ");
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );

 
  const reporterMap = new Map<number, { id: number; name: string; role: string }>();
  for (const row of reportersResult.rows as { id: number; name: string; role: string }[]) {
    reporterMap.set(row.id, row);
  }


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

//  GET SINGLE 
const getSingleIssueFromDB = async (
  id: string
): Promise<IIssueWithReporter> => {
  const result = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Issue not found!") as Error & { statusCode: number };
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const issue = result.rows[0] as IIssueRow;

 
  return attachReporter(issue);
};

//  UPDATE 
const updateIssueInDB = async (
  id: string,
  payload: IUpdateIssuePayload,
  requesterId: number,
  requesterRole: string
): Promise<IIssueRow> => {
  
  const existing = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  if (existing.rows.length === 0) {
    const error = new Error("Issue not found!") as Error & { statusCode: number };
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const issue = existing.rows[0] as IIssueRow;

 
  if (requesterRole === "contributor") {
    if (issue.reporter_id !== requesterId) {
      const error = new Error("Access denied. You can only edit your own issues.") as Error & { statusCode: number };
      error.statusCode = StatusCodes.FORBIDDEN;
      throw error;
    }
    if (issue.status !== "open") {
      const error = new Error("You can only edit issues with status 'open'.") as Error & { statusCode: number };
      error.statusCode = StatusCodes.CONFLICT;
      throw error;
    }
  }

  
  const { title, description, type } = payload;

  if (title !== undefined && title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  if (description !== undefined && description.length < 20) {
    const error = new Error("Description must be at least 20 characters.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  if (type !== undefined && !["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }


  const result = await pool.query(
    `UPDATE issues
     SET
       title       = COALESCE($1, title),
       description = COALESCE($2, description),
       type        = COALESCE($3, type),
       updated_at  = NOW()
     WHERE id = $4
     RETURNING *`,
    [title ?? null, description ?? null, type ?? null, id]
  );

  return result.rows[0] as IIssueRow;
};

//  DELETE 
const deleteIssueFromDB = async (id: string): Promise<void> => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    const error = new Error("Issue not found!") as Error & { statusCode: number };
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};
