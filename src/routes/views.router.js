import { Router } from "express";
import fetch from "node-fetch";
import passport from "passport";
import ProductRepository from '../repository/product.repository.js';
import TicketDAO from "../dao/models/ticket.dao.js";
import UserDTO from "../dao/models/user.dao.js";
import CartRepository from "../repository/cart.repository.js";

const router = Router();

router.get("/login", (req, res) => {
    res.render("login", { title: "Iniciar sesión" });
});

router.get("/register", (req, res) => {
    res.render("register", { title: "Registrarse" });
});

router.post("/register", async (req, res) => {
try {
    const response = await fetch("http://localhost:8081/api/sessions/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
    });

    const data = await response.json();
    if (response.ok) return res.redirect("/login");
    res.status(400).send(data.message);
} catch (err) {
    res.status(500).send("Error al registrar");
}
});

router.post("/login", async (req, res) => {
try {
    const response = await fetch("http://localhost:8081/api/sessions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
    credentials: "include"
    });

    const data = await response.json();
    if (response.ok) return res.redirect("/home");
    res.status(401).send(data.message);
} catch (err) {
    res.status(500).send("Error al iniciar sesión");
}
});

router.get("/cart", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const cart = await CartRepository.getByUserId(req.user._id);
        res.render("cart", { user: req.user, cart });
    } catch (err) {
        res.status(500).send("Error al cargar el carrito");
    }
});

router.get("/home", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const products = await ProductRepository.getAll();
    const safeUser = new UserDTO(req.user);

    res.render("home", {
        user: { ...safeUser, cart: req.user.cart.toString() },
        products
    });
});

router.get("/tickets", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const tid = req.query.tid;
        const ticket = await TicketDAO.getById(tid);
        const productos_fallidos = req.query.fallidos ? JSON.parse(req.query.fallidos) : [];

        res.render("ticket", { user: req.user, ticket, productos_fallidos });
    } catch (error) {
        res.status(500).send("Error al cargar el ticket");
    }
});

export default router;

