import usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  const userExists = await usersService.getUserByEmail(email);
  if (userExists) {
    return next(HttpError(409, "Email already in use"));
  }

  const newUser = await usersService.addUser(email, password);
  res.status(201).json(newUser);
};

export default {
  createUser: ctrlWrapper(createUser),
};