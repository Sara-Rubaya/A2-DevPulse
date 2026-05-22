import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../db";
import config from "../../config";
import type { ILoginPayload, IRegisterPayload, IUserRow } from "./auth.interface";

//  Register 
const registerUserIntoDB = async (payload: IRegisterPayload): Promise<IUserRow> => {
  const { name, email, password, role } = payload;

 
  if (!name || !email || !password) {
    const error = new Error("Name, email and password are required.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

 
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );
  if (existing.rows.length > 0) {
    const error = new Error("Email already registered.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

 
  const allowedRoles = ["contributor", "maintainer"];
  const userRole = role ?? "contributor";
  if (!allowedRoles.includes(userRole)) {
    const error = new Error("Role must be contributor or maintainer.") as Error & { statusCode: number };
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

  return result.rows[0] as IUserRow;
};

//  Login 
const loginUserIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;

 
  if (!email || !password) {
    const error = new Error("Email and password are required.") as Error & { statusCode: number };
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

 
  const userData = await pool.query(
    `SELECT id, name, email, password, role, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );

  if (userData.rows.length === 0) {
    const error = new Error("Invalid credentials!") as Error & { statusCode: number };
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const user = userData.rows[0] as IUserRow & { password: string };


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials!") as Error & { statusCode: number };
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }


  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.secret, { expiresIn: "1d" });

  
  const { password: _password, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
};
