import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
});

export const sendMail = async ({ to, subject, html }) => {
try {
    const info = await transporter.sendMail({
    from: `"Tienda de informatica" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
    });
    console.log("Correo enviado:", info.messageId);
} catch (error) {
    console.error("Error al enviar el correo:", error);
}
};

export default sendMail