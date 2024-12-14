import {
    getCurrentChileanTime,
    compareOnlyDate,
    compareDateTime,
    getCurrentChileanTimestamp,
    formatDateDMY,
} from "./dateUtils.js";

/* Test: Obtener la hora actual en Chile (UTC -3) */
console.log("Test: Obtener la hora actual en Chile (UTC -3)");
console.log(getCurrentChileanTime()); // Debería mostrar la hora actual en Chile

/* Test: Obtener el timestamp en formato ISO */
console.log("\nTest: Obtener el timestamp en formato ISO");
console.log(getCurrentChileanTimestamp()); // Debería mostrar el timestamp actual en formato ISO

/* Test: Formatear fecha en formato 'dd-MM-yyyy' */
console.log("\nTest: Formatear fecha en formato 'dd-MM-yyyy'");
console.log(formatDateDMY()); // Debería mostrar la fecha actual en formato 'dd-MM-yyyy'
console.log(formatDateDMY("2024-12-15")); // Debería mostrar '15-12-2024'

/* Test: Formatear fecha y hora en formato 'dd-MM-yyyy HH:mm' */
console.log("\nTest: Formatear fecha y hora en formato 'dd-MM-yyyy HH:mm'");
console.log(formatDateTimeDMY()); // Debería mostrar la fecha y hora actual en formato 'dd-MM-yyyy HH:mm'
console.log(formatDateTimeDMY("2024-12-15T15:30:00")); // Debería mostrar '15-12-2024 15:30'

/* Test: Comparar solo fechas */
console.log("\nTest: Comparar solo fechas");
const helperMock = { message: (msg) => msg }; // Mock para el objeto helper

// Fecha válida
const dateValid = "2024-12-15";
console.log(`Fecha válida (${dateValid}):`, compareOnlyDate(dateValid, helperMock)); // Debería devolver la fecha ingresada

// Fecha inválida
const dateInvalid = "2024-12-01";
console.log(`Fecha inválida (${dateInvalid}):`, compareOnlyDate(dateInvalid, helperMock)); // Debería mostrar un mensaje de error

/* Test: Comparar fecha y hora */
console.log("\nTest: Comparar fecha y hora");

// Fecha y hora válidas
const dateTimeValid = "2024-12-15T15:30:00";
console.log(`Fecha y hora válidas (${dateTimeValid}):`, compareDateTime(dateTimeValid, helperMock)); // Debería devolver la fecha ingresada

// Fecha y hora inválidas
const dateTimeInvalid = "2024-12-01T10:00:00";
console.log(`Fecha y hora inválidas (${dateTimeInvalid}):`, compareDateTime(dateTimeInvalid, helperMock)); // Debería mostrar un mensaje de error
