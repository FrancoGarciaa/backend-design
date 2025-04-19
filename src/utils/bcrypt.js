import bcrypt from "bcrypt";

export const isValidPassword = (user, password) => {
return bcrypt.compareSync(password, user.password);
};
