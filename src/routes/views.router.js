import { Router } from "express";
import fetch from "node-fetch";
import passport from "passport";

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
    body: JSON.stringify(req.body)
    });

    const data = await response.json();
    if (response.ok) return res.redirect("/profile");
    res.status(401).send(data.message);
} catch (err) {
    res.status(500).send("Error al iniciar sesión");
}
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.render("ticket", { user: req.user }); // Asegurate de tener la vista `ticket.handlebars`
});

export default router;

