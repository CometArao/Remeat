"use strict";

/* Obtiene la hora actual del sistema en Chile (UTC -3). */
export const getCurrentChileanTime = () => {
    const now = new Date(); // Hora actual en UTC
    console.log("Hora actual en UTC:", now);
    now.setHours(now.getHours() - 3); // Ajusta la hora a UTC -3
    console.log("Hora actual en Chile:", now);
    return now;
};

/* Elimina segundos y milisegundos de una fecha. */
export const truncateToMinutes = (date) => {
    const truncatedDate = new Date(date);
    truncatedDate.setSeconds(0, 0); // Elimina segundos y milisegundos
    return truncatedDate;
};

/* Toma un time y le quita los segundos y milisegundos. */
export const truncateToMinutes2 = (time) => {
    if (!time) return ""; // Manejo de valores nulos o indefinidos
    // Asume que `time` viene en formato HH:mm:ss
    return time.slice(0, 5); // Extrae solo HH:mm
};

/* Formatea una fecha y hora en formato 'dd-MM-yyyy HH:mm'. */
export const formatDateTimeCL = (date) => {
    if (!date) return null; // Manejo de valores nulos o indefinidos

    const [fullDate, time] = date.split("T"); // Divide la fecha en "YYYY-MM-DD" y "HH:mm:ss"
    if (!fullDate || !time) {
        throw new Error("Invalid date format");
    }

    const [year, month, day] = fullDate.split("-"); // Divide la parte de la fecha
    let [hours, minutes] = time.split(":"); // Divide la parte de la hora

    // Convertir horas a formato de 12 horas y determinar a.m. o p.m.
    const period = parseInt(hours, 10) >= 12 ? "p.m." : "a.m.";
    hours = (parseInt(hours, 10) % 12) || 12; // Convertir a formato de 12 horas (0 → 12)

    // Retorna la fecha y hora en el formato deseado
    return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
};

/* Compara solo la fecha (día, mes, año) ingresada con la fecha actual en Chile. */
export const compareOnlyDate = (value, helper) => {
    const fechaActual = getCurrentChileanTime();
    const fechaIngresada = new Date(value);

    // Ajusta ambas fechas al inicio del día para ignorar horas
    fechaActual.setHours(0, 0, 0, 0);
    fechaIngresada.setHours(0, 0, 0, 0);

    if (fechaIngresada < fechaActual) {
        return helper.message("La fecha debe ser posterior o igual a la fecha actual.");
    }

    return value;
};

/* Compara la fecha y hora ingresadas con la fecha y hora actuales en Chile. */
export const compareDateTime = (value, helper) => {
    console.log("Valor recibido:", value);
    let fechaIngresada = new Date(value);

    // Agregar segundos si falta ":00"
    if (isNaN(fechaIngresada.getTime())) {
        fechaIngresada = new Date(`${value}:00`);
        console.log("Fecha corregida:", fechaIngresada);
    }

    // Si sigue siendo inválida, retornar error
    if (isNaN(fechaIngresada.getTime())) {
        return helper.message("El formato de la fecha y hora es inválido. Use 'YYYY-MM-DDTHH:mm'.");
    }

    const fechaActual = truncateToMinutes(getCurrentChileanTime());
    console.log("Fecha actual (truncada):", fechaActual);

    if (fechaIngresada < fechaActual) {
        return helper.message("La fecha y hora deben ser posteriores o iguales a la fecha y hora actual.");
    }

    console.log("Fecha válida:", fechaIngresada);
    return null; // Retorna null si la fecha es válida
};

/* Obtiene un timestamp con la hora actual en Chile en formato ISO, truncado a minutos. */
export const getCurrentChileanTimestamp = () => {
    const truncatedDate = truncateToMinutes(getCurrentChileanTime());
    return truncatedDate.toISOString();
};

/* Formatea una fecha en formato 'dd-MM-yyyy'. */

export const formatDateDMY = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("T")[0].split("-"); // Extraer directamente la fecha
    return `${day}-${month}-${year}`;
};

export const formatDateToISO = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("-"); // Divide la fecha
    return `${year}-${month}-${day}`; // Retorna en formato ISO
};
