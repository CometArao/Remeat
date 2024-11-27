"use strict";
import nodemailer from "nodemailer";

// Configuración del transportador
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASS,
    },
});

// Función para enviar correos electrónicos
export const sendEmail = async (to, subject, pedido) => {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html: `
            <h1>Nuevo Pedido Creado</h1>
            <p>Se ha creado un nuevo pedido con los siguientes detalles:</p>
            <ul>
                <li><strong>ID del Pedido:</strong> ${pedido.id_pedido}</li>
                <li><strong>Descripción:</strong> ${pedido.descripcion_pedido}</li>
                <li><strong>Fecha de Compra:</strong> ${pedido.fecha_compra_pedido}</li>
                <li><strong>Fecha de Entrega:</strong> ${pedido.fecha_entrega_pedido}</li>
                <li><strong>Nombre del Usuario:</strong> ${pedido.nombre_usuario}</li>
                <li><strong>Costo:</strong> $${pedido.costo_pedido}</li>
            </ul>
            <p>Gracias por su atención.</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("Error al enviar el correo");
    }
};