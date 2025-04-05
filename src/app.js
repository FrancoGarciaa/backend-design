import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8081;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();

app.use(passport.initialize());

app.use("/api/sessions", sessionsRouter);

const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
        console.log(`Server corriendo en http://localhost:${PORT}`);
    });
    } catch (err) {
    console.error(" Error al conectar en MongoDB:", err.message);
    }
};

connectDB();