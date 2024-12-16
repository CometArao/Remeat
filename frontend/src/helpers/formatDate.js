export function formatearFecha(mfecha) {
    const fecha = new Date(mfecha)
    const dia = String(fecha.getDate()).padStart(2, '0');  
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');  
    const año = fecha.getFullYear();  
    return `${dia}-${mes}-${año}`;  
}
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