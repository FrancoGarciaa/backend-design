import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, 10);

export const isValidPassword = (user, password) =>
bcrypt.compareSync(password, user.password);