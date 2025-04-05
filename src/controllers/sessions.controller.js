import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

const JWT_SECRET = 'secretJWT123';
const JWT_EXPIRES = '1d'; 

export const registerUser = async (req, res) => {
try {
    const { first_name, last_name, email, age, password } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ message: 'User already exists' });

    const newUser = new UserModel({
    first_name,
    last_name,
    email,
    age,
    password 
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
} catch (err) {
    res.status(500).json({ message: 'Internal error', error: err.message });
}
};

export const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = isValidPassword(user, password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES
    });

    res
    .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    })
    .json({ message: 'Login successful' });
} catch (err) {
    res.status(500).json({ message: 'Internal error', error: err.message });
}
};

export const currentUser = (req, res) => {
if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
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