import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema } from "../schemas/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), usersControllers.createUser);

usersRouter.post("/login", validateBody(createUserSchema), usersControllers.loginUser);

export default usersRouter;
