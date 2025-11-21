import express from "express";
import userController from "../controllers/userController.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema } from "../schemas/userSchema.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(createUserSchema), userController.createUser);

userRouter.post("/login", validateBody(createUserSchema), userController.loginUser);

export default userRouter;
