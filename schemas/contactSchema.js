import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(15).required(),
  favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(6).max(15),
  favorite: Joi.boolean(),
}).min(1).messages({"object.min": "Body must have at least one field"});

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});