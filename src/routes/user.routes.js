import {
  getUserData,
  logIn,
  register,
} from "../controllers/user.controller.js";
import { Router } from "express";
import validateToken from "../middlewares/token.middleware.js";
import validateSchema from "../middlewares/schema.middleware.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import validateSession from "../middlewares/session.middleware.js";

const userRoutes = Router();

userRoutes.post("/login", validateSchema(loginSchema), logIn);
userRoutes.post("/register", validateSchema(registerSchema), register);
userRoutes.get("/user", validateToken, validateSession, getUserData);

export default userRoutes;
