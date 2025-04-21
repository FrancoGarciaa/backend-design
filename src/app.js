import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import "./config/passport.config.js";
import Handlebars from "handlebars";


dotenv.config(); 


const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", engine());
Handlebars.registerHelper("multiply", (a, b) => a * b);
Handlebars.registerHelper("calculateTotal", (products) => {
let total = 0;
products.forEach(p => { total += p.product.price * p.quantity; });
return total;})
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(passport.initialize());

app.use("/", viewsRouter);
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