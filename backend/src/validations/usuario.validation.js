"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
    if (!value.endsWith("@gmail.com")) {
        return helper.message(
            "El correo electrónico debe ser del dominio @gmail.com"
        );
    }
    return value;
};

export const userQueryValidation = Joi.object({
    id_usuario: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "number.positive": "El id debe ser un número positivo.",
        }),
    correo_usuario: Joi.string()
         .min(15)
         .max(35)
         .email()
         .messages({
             "string.empty": "El correo electrónico no puede estar vacío.",
             "string.base": "El correo electrónico debe ser de tipo string.",
             "string.email": "El correo electrónico debe finalizar en @gmail.com.",
             "string.min": 
                 "El correo electrónico debe tener como mínimo 15 caracteres.",
             "string.max":
                 "El correo electrónico debe tener como máximo 35 caracteres.",
         })
         .custom(domainEmailValidator,"Validación dominio email"),
})
.or("id_usuario", "correo_usuario")
.unknown(false)
.messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": 
     "Debes proporcionar al menos un parámetro: id o email."
});

export const userBodyValidation = Joi.object({
    nombre_usuario: Joi.string()
         .min(1)
         .max(50)
         .required()
         .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
         .messages({
             "string.empty": "El nombre no puede estar vacío.",
             "string.base": "El nombre debe ser de tipo string.",
             "string.min": "El nombre debe tener como mínimo 1 carácter.",
             "string.max": "El nombre debe tener como máximo 50 caracteres.",
             "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
         }),
     apellido_usuario: Joi.string()
         .min(1)
         .max(50)
         .required()
         .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
         .messages({
             "string.empty": "El apellido no puede estar vacío.",
             "string.base": "El apellido debe ser de tipo string.",
             "string.min": 
                 "El apellido debe tener como mínimo 1 carácter.",
             "string.max":
                 "El apellido debe tener como máximo 50 caracteres.",
             "string.pattern.base":
                 "El apellido solo puede contener letras y espacios.",
         }),
     correo_usuario: Joi.string()
         .min(15)
         .max(35)
         .email()
         .required()
         .messages({
             "string.empty": 
                 "El correo electrónico no puede estar vacío.",
             "string.base":
                 "El correo electrónico debe ser de tipo string.",
             "string.email":
                 "El correo electrónico debe finalizar en @gmail.com.",
             "string.min":
                 "El correo electrónico debe tener como mínimo 15 caracteres.",
             "string.max":
                 "El correo electrónico debe tener como máximo 35 caracteres.",
         })
         .custom(domainEmailValidator,"Validación dominio email"),
     contrasena_usuario: Joi.string()
         .min(8)
         .max(26)
         .pattern(/^[a-zA-Z0-9]+$/)
         .required()
         .messages({
             "string.empty": "La contraseña no puede estar vacía.",
             "string.base": "La contraseña debe ser de tipo string.",
             "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
             "string.max": "La contraseña debe tener como máximo 26 caracteres.",
             "string.pattern.base": "La contraseña solo puede contener letras y números.",
         }),
     contrasena_nueva_usuario: Joi.string()
         .min(8)
         .max(26)
         .pattern(/^[a-zA-Z0-9]+$/)
         .messages({
             "string.empty": "La nueva contraseña no puede estar vacía.",
             "string.base": "La nueva contraseña debe ser de tipo string.",
             "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
             "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
             "string.pattern.base": "La nueva contraseña solo puede contener letras y números.",
         }),
     rol_usuario: Joi.string()
         .valid("administrador", "cocinero", "mesero")
         .required() 
         .messages({
             "any.only": "Rol inválido. Los roles permitidos son: administrador, cocinero o mesero.",
             "any.required": "Se requiere especificar un rol."
         }),
     id_horario_laboral: Joi.number() // Agregar validación para el ID del horario laboral
          .integer()
          .positive()
          .messages({
              "number.base": "El ID del horario laboral debe ser un número.",
              "number.integer": "El ID del horario laboral debe ser un número entero.",
              "number.positive": "El ID del horario laboral debe ser un número positivo.",
              "any.required": "Se requiere especificar el ID del horario laboral."
          }),
 })
.or(
     "nombre_usuario",
     "apellido_usuario",
     "correo_usuario",
     "contrasena_usuario",
     "contrasena_nueva_usuario",
     "rol_usuario",
     "id_horario_laboral" // Asegúrate de que este campo también sea parte de las actualizaciones permitidas.
 )
.unknown(false)
.messages({
     "object.unknown": 
     "No se permiten propiedades adicionales.",
     "object.missing":
     "Debes proporcionar al menos uno de los siguientes campos: nombre completo o email.",
});