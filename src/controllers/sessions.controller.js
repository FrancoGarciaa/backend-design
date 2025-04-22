import jwt from "jsonwebtoken";
import UserModel from "../models/users.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import UserDTO from "../dao/dto/user.dto.js";
import dotenv from "dotenv";
import CartModel from "../models/cart.model.js";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

export const registerUser = async (req, res) => {
    try {

        console.log("usuraio registrado: ", req.body);

    const { first_name, last_name, email, age, password } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ message: "El usuario ya existe" });

    const newCart = await CartModel.create({ products: [] });

    const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password,
        cart: newCart._id
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
    console.log(user);
    if (!user) return res.status(401).json({ message: "No valido" });

    const validPassword = isValidPassword(user, password);
    console.log("Contraseña proporcionada:", password);
    if (!validPassword) return res.status(401).json({ message: "No valido" });

    const safeUser = new UserDTO(user);
    
    const token = jwt.sign({ ...safeUser }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    });
    

    console.log("Token generado:", token);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.redirect("/home");


    
} catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
}
};

export const currentUser = (req, res) => {
    if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
    }

    const safeUser = new UserDTO(req.user);
    res.json({ user: safeUser });
};
