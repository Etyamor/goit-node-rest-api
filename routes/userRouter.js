import express from "express";
import userController from "../controllers/userController.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, updateSubscriptionSchema } from "../schemas/userSchema.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(createUserSchema), userController.createUser);

userRouter.post("/login", validateBody(createUserSchema), userController.loginUser);

userRouter.post("/logout", authenticate, userController.logoutUser);

userRouter.get("/current", authenticate, userController.getCurrentUser);

userRouter.patch("/subscription", authenticate, validateBody(updateSubscriptionSchema), userController.updateSubscription);

userRouter.patch("/avatars", authenticate, upload.single('avatar'), userController.updateAvatar);

export default userRouter;
