import usersService from "../services/userService.js";
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

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await usersService.getUserByEmail(email);
  if (!user || !(await usersService.isPasswordValid(user, password))) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  const token = await usersService.createUserToken(user);

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

const logoutUser = async (req, res) => {
  await usersService.logoutUser(req.user);
  res.status(204).end();
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export default {
  createUser: ctrlWrapper(createUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
};