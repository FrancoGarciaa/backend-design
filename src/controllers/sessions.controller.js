import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const JWT_SECRET = "secretJWT123";
const JWT_EXPIRES = "1d"; 

export const registerUser = async (req, res) => {
    try {
    const { first_name, last_name, email, age, password } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = createHash(password);

    const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Registro exitoso :D" });
    } catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
    }
};

export const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "No valido" });

    const validPassword = isValidPassword(user, password);
    if (!validPassword) return res.status(401).json({ message: "No valido" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES
    });

    res
    .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })
    .json({ message: "Inicio de sesion exitosa :D" });
} catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
}
};

export const currentUser = (req, res) => {
if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
}

const { first_name, last_name, email, age, role } = req.user;

res.json({
    user: {
    first_name,
    last_name,
    email,
    age,
    role
    }
});
};