import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema } from "../schemas/usersSchemas.js";
import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../schemas/contactsSchemas.js";

const usersRouter = express.Router();

usersRouter.post("/auth/register", validateBody(createUserSchema), usersControllers.createUser);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:id", contactsController.getOneContact);

contactsRouter.delete("/:id", contactsController.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), contactsController.createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), contactsController.updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateStatusContactSchema), contactsController.updateContact);

export default contactsRouter;
