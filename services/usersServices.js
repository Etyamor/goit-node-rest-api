import User from '../models/user.js';
import bcrypt from 'bcrypt';

async function getUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email, password: hashedPassword,
  });
  return { user: { email: user.email, subscription: user.subscription } };
}

export default {
  getUserByEmail, addUser,
};
