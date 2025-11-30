import usersService from "../services/userService.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import path from "path";
import * as fs from "node:fs/promises";
import { transporter } from "../services/mailService.js";

const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  const userExists = await usersService.getUserByEmail(email);
  if (userExists) {
    return next(HttpError(409, "Email already in use"));
  }

  const { user, verificationToken } = await usersService.addUser(email, password);

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api/auth';
  const verifyLink = `${baseUrl}/verify/${verificationToken}`;

  try {
    await transporter.sendMail({
      from: "maxikrud0071@ukr.net",
      to: email,
      subject: 'Verify your email',
      html: `<p>Welcome! Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify Email</a></p>`,
      text: `Please verify your email by visiting: ${verifyLink}`,
    });
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
  }

  res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await usersService.getUserByEmail(email);
  if (!user || !(await usersService.isPasswordValid(user, password))) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  if (!user.verify) {
    return next(HttpError(401, "Email not verified"));
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

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const updatedUser = await usersService.updateUserSubscription(req.user.id, subscription);
  res.json({updatedUser});
}

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "No file uploaded"));
  }

  const { path: tempPath, originalname } = req.file;
  const extension = path.extname(originalname);
  const filename = `${req.user.id}${extension}`;
  const avatarPath = path.join(process.cwd(), 'public', 'avatars', filename);

  try {
    await fs.rename(tempPath, avatarPath);
    const avatarURL = `/avatars/${filename}`;
    const updatedUser = await usersService.updateUserAvatar(req.user.id, avatarURL);
    res.json({ avatarURL: updatedUser.avatarURL });
  } catch (error) {
    await fs.unlink(tempPath).catch(() => {});
    throw error;
  }
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await usersService.verifyUserByToken(verificationToken);
  if (!user) {
    return next(HttpError(404, 'Not Found'));
  }
  res.json({ message: 'Verification successful' });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await usersService.getUserByEmail(email);
  if (!user) {
    // Don’t reveal whether the email exists; respond success-like to avoid enumeration.
    return res.status(200).json({ message: "If the account exists and is not verified, a verification email has been sent." });
  }

  if (user.verify) {
    return res.status(400).json({ message: "Verification has already been passed" });
  }

  const { verificationToken } = user;
  if (!verificationToken) {
    user.verificationToken = (await import('nanoid')).nanoid();
    await user.save();
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api/auth';
  const verifyLink = `${baseUrl}/verify/${user.verificationToken}`;

  try {
    await transporter.sendMail({
      from: "maxikrud0071@ukr.net",
      to: email,
      subject: 'Verify your email',
      html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify Email</a></p>`,
      text: `Please verify your email by visiting: ${verifyLink}`,
    });
  } catch (err) {
    console.error('Failed to resend verification email:', err.message);
  }

  res.status(200).json({ message: 'Verification email sent' });
};

export default {
  createUser: ctrlWrapper(createUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyUser: ctrlWrapper(verifyUser),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};