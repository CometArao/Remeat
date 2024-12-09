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

// Función para enviar el correo electrónico
export const sendEmail = async (to, subject, pedido) => {
    const mailOptions = {
        from: `"Equipo de Remeat" <${process.env.MAIL_USERNAME}>`,
        to,
        subject,
        html: generarPlantillaCorreo(pedido),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email enviado: " + info.response);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("Error al enviar el correo");
    }
};

// Función para formatear fechas al formato "DD-MM-YYYY"
function formatFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
}

// Función para generar la plantilla de correo electrónico
function generarPlantillaCorreo(pedido) {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Nuevo Pedido Creado</h2>
            <p>Estimado(a) ${pedido.nombre_proveedor},</p>
            <p>Se ha creado un nuevo pedido con los siguientes detalles:</p>
            <hr>
            <h3>Información del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>ID del Pedido:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${pedido.id_pedido}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Descripción:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${pedido.descripcion_pedido}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fecha de Compra:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${formatFecha(pedido.fecha_compra_pedido)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fecha de Entrega:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${formatFecha(pedido.fecha_entrega_pedido)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre del Cliente:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${pedido.nombre_usuario}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Costo Total:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">$${pedido.costo_pedido}</td>
                </tr>
            </table>
            <h3>Ingredientes</h3>
            ${pedido.ingredientes && pedido.ingredientes.length > 0 ? 
                generarTablaIngredientes(pedido.ingredientes) : "<p>No hay ingredientes en este pedido.</p>"}
            <h3>Utensilios</h3>
            ${pedido.utensilios && pedido.utensilios.length > 0 ? 
                generarTablaUtensilios(pedido.utensilios) : "<p>No hay utensilios en este pedido.</p>"}
            <p>Por favor, confirme la recepción de este pedido y proceda con su procesamiento.</p>
            <p>Gracias por su atención.</p>
            <p>Atentamente,<br>El equipo de Remeat</p>
            <hr>
            <p style="font-size: 12px; color: #777;">Este es un correo 
            generado automáticamente, por favor no responda a este mensaje.</p>
        </div>
    `;
}

// Función para generar la tabla de ingredientes
function generarTablaIngredientes(ingredientes) {
    return `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Nombre</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Costo unitario</th>
                </tr>
            </thead>
            <tbody>
                ${ingredientes.map(ing => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ing.id_ingrediente}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ing.nombre_tipo_ingrediente}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ing.cantidad_ingrediente || 0}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">$${ing.costo_ingrediente}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

// Función para generar la tabla de utensilios
function generarTablaUtensilios(utensilios) {
    return `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Nombre</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Costo unitario</th>
                </tr>
            </thead>
            <tbody>
                ${utensilios.map(ut => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ut.id_utensilio}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ut.nombre_tipo_utensilio}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${ut.cantidad_utensilio || 0}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">$${ut.costo_utensilio}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
