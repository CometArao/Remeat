export const mermaValidation = Joi.object({
    id_merma: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
    fecha: Joi.date()
    
    .message({
        "string.empty": "El nombre del tipo utensilio no puede estar vacío.",
        "string.base": "El nombre del tipo utensilio debe ser de tipo string.",
        "string.min":
            "El nombre del tipo utensiliodebe tener como mínimo 1 caracteres.",
        "string.max":
            "El nombre del tipo utensilio debe tener como máximo 50 caracteres.",
    }),
    cantidad_perdida: Joi.integer()
    .integer()
    .positive()
    .message({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    })

})