

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

// node_modules/http-status-codes/build/es/legacy.js
var ACCEPTED = 202;
var BAD_GATEWAY = 502;
var BAD_REQUEST = 400;
var CONFLICT = 409;
var CONTINUE = 100;
var CREATED = 201;
var EXPECTATION_FAILED = 417;
var FORBIDDEN = 403;
var GATEWAY_TIMEOUT = 504;
var GONE = 410;
var HTTP_VERSION_NOT_SUPPORTED = 505;
var IM_A_TEAPOT = 418;
var INSUFFICIENT_SPACE_ON_RESOURCE = 419;
var INSUFFICIENT_STORAGE = 507;
var INTERNAL_SERVER_ERROR = 500;
var LENGTH_REQUIRED = 411;
var LOCKED = 423;
var METHOD_FAILURE = 420;
var METHOD_NOT_ALLOWED = 405;
var MOVED_PERMANENTLY = 301;
var MOVED_TEMPORARILY = 302;
var MULTI_STATUS = 207;
var MULTIPLE_CHOICES = 300;
var NETWORK_AUTHENTICATION_REQUIRED = 511;
var NO_CONTENT = 204;
var NON_AUTHORITATIVE_INFORMATION = 203;
var NOT_ACCEPTABLE = 406;
var NOT_FOUND = 404;
var NOT_IMPLEMENTED = 501;
var NOT_MODIFIED = 304;
var OK = 200;
var PARTIAL_CONTENT = 206;
var PAYMENT_REQUIRED = 402;
var PERMANENT_REDIRECT = 308;
var PRECONDITION_FAILED = 412;
var PRECONDITION_REQUIRED = 428;
var PROCESSING = 102;
var PROXY_AUTHENTICATION_REQUIRED = 407;
var REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
var REQUEST_TIMEOUT = 408;
var REQUEST_TOO_LONG = 413;
var REQUEST_URI_TOO_LONG = 414;
var REQUESTED_RANGE_NOT_SATISFIABLE = 416;
var RESET_CONTENT = 205;
var SEE_OTHER = 303;
var SERVICE_UNAVAILABLE = 503;
var SWITCHING_PROTOCOLS = 101;
var TEMPORARY_REDIRECT = 307;
var TOO_MANY_REQUESTS = 429;
var UNAUTHORIZED = 401;
var UNPROCESSABLE_ENTITY = 422;
var UNSUPPORTED_MEDIA_TYPE = 415;
var USE_PROXY = 305;
var legacy_default = {
  ACCEPTED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CONTINUE,
  CREATED,
  EXPECTATION_FAILED,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  GONE,
  HTTP_VERSION_NOT_SUPPORTED,
  IM_A_TEAPOT,
  INSUFFICIENT_SPACE_ON_RESOURCE,
  INSUFFICIENT_STORAGE,
  INTERNAL_SERVER_ERROR,
  LENGTH_REQUIRED,
  LOCKED,
  METHOD_FAILURE,
  METHOD_NOT_ALLOWED,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  MULTI_STATUS,
  MULTIPLE_CHOICES,
  NETWORK_AUTHENTICATION_REQUIRED,
  NO_CONTENT,
  NON_AUTHORITATIVE_INFORMATION,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  NOT_MODIFIED,
  OK,
  PARTIAL_CONTENT,
  PAYMENT_REQUIRED,
  PERMANENT_REDIRECT,
  PRECONDITION_FAILED,
  PRECONDITION_REQUIRED,
  PROCESSING,
  PROXY_AUTHENTICATION_REQUIRED,
  REQUEST_HEADER_FIELDS_TOO_LARGE,
  REQUEST_TIMEOUT,
  REQUEST_TOO_LONG,
  REQUEST_URI_TOO_LONG,
  REQUESTED_RANGE_NOT_SATISFIABLE,
  RESET_CONTENT,
  SEE_OTHER,
  SERVICE_UNAVAILABLE,
  SWITCHING_PROTOCOLS,
  TEMPORARY_REDIRECT,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  UNSUPPORTED_MEDIA_TYPE,
  USE_PROXY
};

// node_modules/http-status-codes/build/es/utils.js
var statusCodeToReasonPhrase = {
  "202": "Accepted",
  "502": "Bad Gateway",
  "400": "Bad Request",
  "409": "Conflict",
  "100": "Continue",
  "201": "Created",
  "417": "Expectation Failed",
  "424": "Failed Dependency",
  "403": "Forbidden",
  "504": "Gateway Timeout",
  "410": "Gone",
  "505": "HTTP Version Not Supported",
  "418": "I'm a teapot",
  "419": "Insufficient Space on Resource",
  "507": "Insufficient Storage",
  "500": "Internal Server Error",
  "411": "Length Required",
  "423": "Locked",
  "420": "Method Failure",
  "405": "Method Not Allowed",
  "301": "Moved Permanently",
  "302": "Moved Temporarily",
  "207": "Multi-Status",
  "300": "Multiple Choices",
  "511": "Network Authentication Required",
  "204": "No Content",
  "203": "Non Authoritative Information",
  "406": "Not Acceptable",
  "404": "Not Found",
  "501": "Not Implemented",
  "304": "Not Modified",
  "200": "OK",
  "206": "Partial Content",
  "402": "Payment Required",
  "308": "Permanent Redirect",
  "412": "Precondition Failed",
  "428": "Precondition Required",
  "102": "Processing",
  "103": "Early Hints",
  "426": "Upgrade Required",
  "407": "Proxy Authentication Required",
  "431": "Request Header Fields Too Large",
  "408": "Request Timeout",
  "413": "Request Entity Too Large",
  "414": "Request-URI Too Long",
  "416": "Requested Range Not Satisfiable",
  "205": "Reset Content",
  "303": "See Other",
  "503": "Service Unavailable",
  "101": "Switching Protocols",
  "307": "Temporary Redirect",
  "429": "Too Many Requests",
  "401": "Unauthorized",
  "451": "Unavailable For Legal Reasons",
  "422": "Unprocessable Entity",
  "415": "Unsupported Media Type",
  "305": "Use Proxy",
  "421": "Misdirected Request"
};
var reasonPhraseToStatusCode = {
  "Accepted": 202,
  "Bad Gateway": 502,
  "Bad Request": 400,
  "Conflict": 409,
  "Continue": 100,
  "Created": 201,
  "Expectation Failed": 417,
  "Failed Dependency": 424,
  "Forbidden": 403,
  "Gateway Timeout": 504,
  "Gone": 410,
  "HTTP Version Not Supported": 505,
  "I'm a teapot": 418,
  "Insufficient Space on Resource": 419,
  "Insufficient Storage": 507,
  "Internal Server Error": 500,
  "Length Required": 411,
  "Locked": 423,
  "Method Failure": 420,
  "Method Not Allowed": 405,
  "Moved Permanently": 301,
  "Moved Temporarily": 302,
  "Multi-Status": 207,
  "Multiple Choices": 300,
  "Network Authentication Required": 511,
  "No Content": 204,
  "Non Authoritative Information": 203,
  "Not Acceptable": 406,
  "Not Found": 404,
  "Not Implemented": 501,
  "Not Modified": 304,
  "OK": 200,
  "Partial Content": 206,
  "Payment Required": 402,
  "Permanent Redirect": 308,
  "Precondition Failed": 412,
  "Precondition Required": 428,
  "Processing": 102,
  "Early Hints": 103,
  "Upgrade Required": 426,
  "Proxy Authentication Required": 407,
  "Request Header Fields Too Large": 431,
  "Request Timeout": 408,
  "Request Entity Too Large": 413,
  "Request-URI Too Long": 414,
  "Requested Range Not Satisfiable": 416,
  "Reset Content": 205,
  "See Other": 303,
  "Service Unavailable": 503,
  "Switching Protocols": 101,
  "Temporary Redirect": 307,
  "Too Many Requests": 429,
  "Unauthorized": 401,
  "Unavailable For Legal Reasons": 451,
  "Unprocessable Entity": 422,
  "Unsupported Media Type": 415,
  "Use Proxy": 305,
  "Misdirected Request": 421
};

// node_modules/http-status-codes/build/es/utils-functions.js
function getReasonPhrase(statusCode) {
  var result = statusCodeToReasonPhrase[statusCode.toString()];
  if (!result) {
    throw new Error("Status code does not exist: " + statusCode);
  }
  return result;
}
function getStatusCode(reasonPhrase) {
  var result = reasonPhraseToStatusCode[reasonPhrase];
  if (!result) {
    throw new Error("Reason phrase does not exist: " + reasonPhrase);
  }
  return result;
}
var getStatusText = getReasonPhrase;

// node_modules/http-status-codes/build/es/status-codes.js
var StatusCodes;
(function(StatusCodes2) {
  StatusCodes2[StatusCodes2["CONTINUE"] = 100] = "CONTINUE";
  StatusCodes2[StatusCodes2["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
  StatusCodes2[StatusCodes2["PROCESSING"] = 102] = "PROCESSING";
  StatusCodes2[StatusCodes2["EARLY_HINTS"] = 103] = "EARLY_HINTS";
  StatusCodes2[StatusCodes2["OK"] = 200] = "OK";
  StatusCodes2[StatusCodes2["CREATED"] = 201] = "CREATED";
  StatusCodes2[StatusCodes2["ACCEPTED"] = 202] = "ACCEPTED";
  StatusCodes2[StatusCodes2["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
  StatusCodes2[StatusCodes2["NO_CONTENT"] = 204] = "NO_CONTENT";
  StatusCodes2[StatusCodes2["RESET_CONTENT"] = 205] = "RESET_CONTENT";
  StatusCodes2[StatusCodes2["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
  StatusCodes2[StatusCodes2["MULTI_STATUS"] = 207] = "MULTI_STATUS";
  StatusCodes2[StatusCodes2["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
  StatusCodes2[StatusCodes2["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
  StatusCodes2[StatusCodes2["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
  StatusCodes2[StatusCodes2["SEE_OTHER"] = 303] = "SEE_OTHER";
  StatusCodes2[StatusCodes2["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
  StatusCodes2[StatusCodes2["USE_PROXY"] = 305] = "USE_PROXY";
  StatusCodes2[StatusCodes2["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
  StatusCodes2[StatusCodes2["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
  StatusCodes2[StatusCodes2["BAD_REQUEST"] = 400] = "BAD_REQUEST";
  StatusCodes2[StatusCodes2["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  StatusCodes2[StatusCodes2["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
  StatusCodes2[StatusCodes2["FORBIDDEN"] = 403] = "FORBIDDEN";
  StatusCodes2[StatusCodes2["NOT_FOUND"] = 404] = "NOT_FOUND";
  StatusCodes2[StatusCodes2["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
  StatusCodes2[StatusCodes2["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
  StatusCodes2[StatusCodes2["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
  StatusCodes2[StatusCodes2["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
  StatusCodes2[StatusCodes2["CONFLICT"] = 409] = "CONFLICT";
  StatusCodes2[StatusCodes2["GONE"] = 410] = "GONE";
  StatusCodes2[StatusCodes2["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
  StatusCodes2[StatusCodes2["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
  StatusCodes2[StatusCodes2["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
  StatusCodes2[StatusCodes2["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
  StatusCodes2[StatusCodes2["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
  StatusCodes2[StatusCodes2["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
  StatusCodes2[StatusCodes2["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
  StatusCodes2[StatusCodes2["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
  StatusCodes2[StatusCodes2["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
  StatusCodes2[StatusCodes2["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
  StatusCodes2[StatusCodes2["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
  StatusCodes2[StatusCodes2["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
  StatusCodes2[StatusCodes2["LOCKED"] = 423] = "LOCKED";
  StatusCodes2[StatusCodes2["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
  StatusCodes2[StatusCodes2["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
  StatusCodes2[StatusCodes2["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
  StatusCodes2[StatusCodes2["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
  StatusCodes2[StatusCodes2["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
  StatusCodes2[StatusCodes2["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
  StatusCodes2[StatusCodes2["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
  StatusCodes2[StatusCodes2["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
  StatusCodes2[StatusCodes2["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
  StatusCodes2[StatusCodes2["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
  StatusCodes2[StatusCodes2["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
  StatusCodes2[StatusCodes2["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
  StatusCodes2[StatusCodes2["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
  StatusCodes2[StatusCodes2["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
})(StatusCodes || (StatusCodes = {}));

// node_modules/http-status-codes/build/es/index.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var es_default = __assign(__assign({}, legacy_default), {
  getStatusCode,
  getStatusText
});

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
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: newUser
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
      statusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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

// src/modules/issues/issues.service.ts
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
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  if (title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  if (description.length < 20) {
    const error = new Error("Description must be at least 20 characters.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  if (!["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  const userCheck = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [reporterId]
  );
  if (userCheck.rows.length === 0) {
    const error = new Error("Reporter user not found.");
    error.statusCode = StatusCodes.NOT_FOUND;
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
    error.statusCode = StatusCodes.NOT_FOUND;
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
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  const issue = existing.rows[0];
  if (requesterRole === "contributor") {
    if (issue.reporter_id !== requesterId) {
      const error = new Error("Access denied. You can only edit your own issues.");
      error.statusCode = StatusCodes.FORBIDDEN;
      throw error;
    }
    if (issue.status !== "open") {
      const error = new Error("You can only edit issues with status 'open'.");
      error.statusCode = StatusCodes.CONFLICT;
      throw error;
    }
  }
  const { title, description, type } = payload;
  if (title !== void 0 && title.length > 150) {
    const error = new Error("Title must not exceed 150 characters.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  if (description !== void 0 && description.length < 20) {
    const error = new Error("Description must be at least 20 characters.");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }
  if (type !== void 0 && !["bug", "feature_request"].includes(type)) {
    const error = new Error("Type must be bug or feature_request.");
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
  return result.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id]
  );
  if (result.rowCount === 0) {
    const error = new Error("Issue not found!");
    error.statusCode = StatusCodes.NOT_FOUND;
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
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: result
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    const err = error;
    sendResponse_default(res, {
      statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
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
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found!"
        });
        return;
      }
      if (roles.length && !roles.includes(user.role)) {
        res.status(StatusCodes.FORBIDDEN).json({
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
var globalErrorHandler = (err, req, res, _next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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