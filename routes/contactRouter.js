import express from "express";
import contactController from "../controllers/contactController.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../schemas/contactSchema.js";

const contactRouter = express.Router();

contactRouter.get("/", contactController.getAllContacts);

contactRouter.get("/:id", contactController.getOneContact);

contactRouter.delete("/:id", contactController.deleteContact);

contactRouter.post("/", validateBody(createContactSchema), contactController.createContact);

contactRouter.put("/:id", validateBody(updateContactSchema), contactController.updateContact);

contactRouter.patch("/:id/favorite", validateBody(updateStatusContactSchema), contactController.updateContact);

export default contactRouter;
