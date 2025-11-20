import User from '../models/user.js';

async function getUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

async function addUser(email, password) {
  const user = await User.create({
    email,
    password,
  });
  return { user: { email: user.email, subscription: user.subscription } };
}

export default {
  getUserByEmail,
  addUser,
};
