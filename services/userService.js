import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import gravatar from 'gravatar';

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
  const avatarURL = gravatar.url(email, { s: '250', d: 'retro' }, true);

  const user = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
  });

  return { user: { email: user.email, subscription: user.subscription, avatarURL: user.avatarURL } };
}

async function logoutUser(user) {
  user.token = null;
  await user.save();
}

async function updateUserSubscription(userId, subscription) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }
  user.subscription = subscription;
  await user.save();
  return { email: user.email, subscription: user.subscription };
}

async function updateUserAvatar(userId, avatarURL) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }
  user.avatarURL = avatarURL;
  await user.save();
  return user;
}

export default {
  getUserByEmail, isPasswordValid, createUserToken, addUser, logoutUser, updateUserSubscription, updateUserAvatar
};
