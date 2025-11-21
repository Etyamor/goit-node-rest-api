import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

async function getUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

async function isPasswordValid(user, password) {
  return await bcrypt.compare(password, user.password);
}

async function createUserToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  user.token = token;
  await user.save();
  return token;
}

async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email, password: hashedPassword,
  });
  return { user: { email: user.email, subscription: user.subscription } };
}

async function logoutUser(user) {
  user.token = null;
  await user.save();
}

export default {
  getUserByEmail, isPasswordValid, createUserToken, addUser, logoutUser,
};
