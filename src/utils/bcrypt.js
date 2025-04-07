import bcrypt from 'bcrypt';

export const isValidPassword = (user, password) =>
bcrypt.compareSync(password, user.password);