import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import "./config/passport.config.js";
import cartsRouter from "./routes/carts.router.js";
import cors from "cors";
import handlebars from "express-handlebars"

dotenv.config(); 

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = handlebars.create({
    runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
    },
    helpers: {
      multiply: (a, b) => a * b,
    calculateTotal: (products) => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((total, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 0;
          return total + price * quantity;
        }, 0);
    }
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin: "http://localhost:8081",
    credentials: true
}));

app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "test",
        });
        console.log("MongoDB conectado correctamente");
        app.listen(PORT, () => {
            console.log(`Server corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Error al conectar en MongoDB:", err.message);
    }
};

connectDB();