

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT || 8e3,
  secret: process.env.JWT_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(100) UNIQUE NOT NULL,
        password    TEXT NOT NULL,
        role        VARCHAR(20) NOT NULL DEFAULT 'contributor'
                      CHECK (role IN ('contributor', 'maintainer')),
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(150) NOT NULL,
        description  TEXT NOT NULL,
        type         VARCHAR(20) NOT NULL
                       CHECK (type IN ('bug', 'feature_request')),
        status       VARCHAR(20) NOT NULL DEFAULT 'open'
                       CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id  INT NOT NULL,
        created_at   TIMESTAMP DEFAULT NOW(),
        updated_at   TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

// src/app.ts
import cors from "cors";

// src/middleware/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  console.log(
    "Method - URL - Time:",
    req.method,
    req.url,
    Date.now()
  );
  const log = `
Method -> ${req.method} - Time -> ${Date.now()} - URL -> ${req.url}
`;
  fs.appendFile("logger.txt", log, () => {
  });
  next();
};
var logger_default = logger;

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/modules/auth/auth.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";

// src/utility/sendResponse.ts
var sendResponse = (res, payload) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    errors: payload.errors
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
var registerUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password) {
    const error = new Error("Name, email and password are required.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );
  if (existing.rows.length > 0) {
    const error = new Error("Email already registered.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  const allowedRoles = ["contributor", "maintainer"];
  const userRole = role ?? "contributor";
  if (!allowedRoles.includes(userRole)) {
    const error = new Error("Role must be contributor or maintainer.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, userRole]
  );
  return result.rows[0];
};
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  const userData = await pool.query(
    `SELECT id, name, email, password, role, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );
  if (userData.rows.length === 0) {
    const error = new Error("Invalid credentials!");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }
  const user = userData.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials!");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const token = jwt.sign(jwtPayload, config_default.secret, { expiresIn: "1d" });
  const { password: _password, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};
var authService = {
  registerUserIntoDB,
  loginUserIntoDB
};

// src/modules/auth/auth.controller.ts
var signup = async (req, res) => {
  try {
    const payload = req.body;
    const newUser = await authService.registerUserIntoDB(payload);
    sendResponse_default(res, {
      statusCode: StatusCodes2.CREATED,
      success: true,
      message: "User registered successfully",
      data: newUser
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes2.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var login = async (req, res) => {
  try {
    const payload = req.body;
    const result = await authService.loginUserIntoDB(payload);
    sendResponse_default(res, {
      statusCode: StatusCodes2.OK,
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes2.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var authController = {
  signup,
  login
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
var authRoute = router;

// src/modules/issues/issues.route.ts
import { Router as Router2 } from "express";

// src/modules/issues/issues.controller.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";

// src/modules/issues/issues.service.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var attachReporter = async (issue) => {
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );
  const reporter = reporterResult.rows[0];
  const { reporter_id, ...issueWithoutReporterId } = issue;
  void reporter_id;
  return {
    ...issueWithoutReporterId,
    reporter: reporter ?? { id: 0, name: "Unknown", role: "contributor" }
  };
};
var createIssueIntoDB = async (payload, reporterId) => {
  const { title, description, type } = payload;
  if (!title || !description || !type) {
    const error = new Error("Title, description and type are required.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  if (title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  if (description.length < 20) {
    const error = new Error("Description must be at least 20 characters.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  if (!["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  const userCheck = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [reporterId]
  );
  if (userCheck.rows.length === 0) {
    const error = new Error("Reporter user not found.");
    error.statusCode = StatusCodes3.NOT_FOUND;
    throw error;
  }
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId]
  );
  return result.rows[0];
};
var getAllIssuesFromDB = async (query) => {
  const { sort = "newest", type, status } = query;
  const conditions = [];
  const values = [];
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
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderDir = sort === "oldest" ? "ASC" : "DESC";
  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ORDER BY created_at ${orderDir}`,
    values
  );
  const issues = result.rows;
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
  if (reporterIds.length === 0) return [];
  const placeholders = reporterIds.map((_, i) => `$${i + 1}`).join(", ");
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );
  const reporterMap = /* @__PURE__ */ new Map();
  for (const row of reportersResult.rows) {
    reporterMap.set(row.id, row);
  }
  return issues.map((issue) => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporterMap.get(reporter_id) ?? {
        id: reporter_id,
        name: "Unknown",
        role: "contributor"
      }
    };
  });
};
var getSingleIssueFromDB = async (id) => {
  const result = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    const error = new Error("Issue not found!");
    error.statusCode = StatusCodes3.NOT_FOUND;
    throw error;
  }
  const issue = result.rows[0];
  return attachReporter(issue);
};
var updateIssueInDB = async (id, payload, requesterId, requesterRole) => {
  const existing = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  if (existing.rows.length === 0) {
    const error = new Error("Issue not found!");
    error.statusCode = StatusCodes3.NOT_FOUND;
    throw error;
  }
  const issue = existing.rows[0];
  if (requesterRole === "contributor") {
    if (issue.reporter_id !== requesterId) {
      const error = new Error("Access denied. You can only edit your own issues.");
      error.statusCode = StatusCodes3.FORBIDDEN;
      throw error;
    }
    if (issue.status !== "open") {
      const error = new Error("You can only edit issues with status 'open'.");
      error.statusCode = StatusCodes3.CONFLICT;
      throw error;
    }
  }
  const { title, description, type } = payload;
  if (title !== void 0 && title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  if (description !== void 0 && description.length < 20) {
    const error = new Error("Description must be at least 20 characters.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
    throw error;
  }
  if (type !== void 0 && !["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.");
    error.statusCode = StatusCodes3.BAD_REQUEST;
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
  return result.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id]
  );
  if (result.rowCount === 0) {
    const error = new Error("Issue not found!");
    error.statusCode = StatusCodes3.NOT_FOUND;
    throw error;
  }
};
var issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB
};

// src/modules/issues/issues.controller.ts
var createIssue = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const payload = req.body;
    const result = await issuesService.createIssueIntoDB(payload, reporterId);
    sendResponse_default(res, {
      statusCode: StatusCodes4.CREATED,
      success: true,
      message: "Issue created successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes4.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const query = req.query;
    const result = await issuesService.getAllIssuesFromDB(query);
    sendResponse_default(res, {
      statusCode: StatusCodes4.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes4.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var getSingleIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssueFromDB(id);
    sendResponse_default(res, {
      statusCode: StatusCodes4.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes4.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    const result = await issuesService.updateIssueInDB(
      id,
      payload,
      requesterId,
      requesterRole
    );
    sendResponse_default(res, {
      statusCode: StatusCodes4.OK,
      success: true,
      message: "Issue updated successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes4.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    await issuesService.deleteIssueFromDB(id);
    sendResponse_default(res, {
      statusCode: StatusCodes4.OK,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes4.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      errors: err
    });
  }
};
var issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/types/index.ts
var USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
  user: "user"
};

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
import { StatusCodes as StatusCodes5 } from "http-status-codes";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(StatusCodes5.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized! No token provided."
        });
        return;
      }
      const decoded = jwt2.verify(token, config_default.secret);
      const userData = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [decoded.id]
      );
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(StatusCodes5.NOT_FOUND).json({
          success: false,
          message: "User not found!"
        });
        return;
      }
      if (roles.length && !roles.includes(user.role)) {
        res.status(StatusCodes5.FORBIDDEN).json({
          success: false,
          message: "Access denied. Insufficient permissions."
        });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/modules/issues/issues.route.ts
var router2 = Router2();
router2.post(
  "/",
  auth_default(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssue
);
router2.get("/", issuesController.getAllIssues);
router2.get("/:id", issuesController.getSingleIssue);
router2.patch(
  "/:id",
  auth_default(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateIssue
);
router2.delete(
  "/:id",
  auth_default(USER_ROLE.maintainer),
  issuesController.deleteIssue
);
var issuesRoute = router2;

// src/middleware/globalErrorHandler.ts
import { StatusCodes as StatusCodes6 } from "http-status-codes";
var globalErrorHandler = (err, req, res, _next) => {
  res.status(StatusCodes6.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger_default);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  })
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dev Pulse Server",
    "author": "Sara Rubaya"
  });
});
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found.`
  });
});
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var port = config_default.port;
var main = async () => {
  initDB();
  app_default.listen(port, () => {
    console.log(`DevPulse server listening on port ${port}`);
  });
};
main();
//# sourceMappingURL=server.js.map