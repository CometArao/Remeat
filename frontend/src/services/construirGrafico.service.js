
//TODO: pruebas

export function construirLinealPlatillosIngresos(datos, time) {
    console.log("construir")
    console.log(datos)
    console.log(time)
    let x = null
    let result = [];
    const keys = Object.keys(datos)
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    for (let i = 0; i < keys.length; i++) {
        console.log("datos")
        console.log(datos)
        const ventas = datos[keys[i]]['ventas_por_comanda'];
        let indice_color = 0;
        let formatedVentas = []
        for (let ii = 0; ii < ventas.length; ii++) {
            if(time === "Hora") {
                x = ventas[ii].hora_compra
            }
            if(time === "Fecha") {
                x = formatearFecha(ventas[ii].fecha_compra)
            }
            if(time === "Mes") {
                x = ventas[ii].fecha_compra
            }
            if(time === "Año") {
                x = ventas[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": ventas[ii].ingresos_platillo
            }
            formatedVentas.push(obj);
        }
        if(time === "Mes") {
            truncarMes(obj)
        }
        if(time === "Año") {
            truncarAño(obj)
        }
        const obj = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedVentas
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj);
    }
    return result;
}
export function construirLinealPlatillosVentas(datos, time) {
    console.log("datos")
    console.log(datos)
    let x = null
    let result = [];
    const keys = Object.keys(datos)
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    for (let i = 0; i < keys.length; i++) {
        console.log("datos")
        console.log(datos)
        const ventas = datos[keys[i]]['ventas_por_comanda'];
        let indice_color = 0;
        let formatedVentas = []
        for (let ii = 0; ii < ventas.length; ii++) {
            if(time === "Hora") {
                x = ventas[ii].hora_compra
            }
            if(time === "Fecha") {
                x = formatearFecha(ventas[ii].fecha_compra)
            }
            if(time === "Mes") {
                x = ventas[ii].fecha_compra
            }
            if(time === "Año") {
                x = ventas[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": ventas[ii].cantidad_platillo
            }
            formatedVentas.push(obj);
        }
        if(time === "Mes") {
            truncarMes(obj)
        }
        if(time === "Año") {
            truncarAño(obj)
        }
        const obj = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedVentas
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj);
    }
    return result;
}
function truncarMes(obj) {
    //TODO: sin implementar

}
function truncarAño(obj) {
    //TODO: sin implementar
}
function formatearFecha(mfecha) {
    console.log("fecha")
    console.log(mfecha)
    let fecha = new Date(mfecha)
    console.log(fecha)
    const dia = String(fecha.getDate()).padStart(2, '0');  // Obtener el día y asegurarse de que tenga 2 dígitos
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');  // Obtener el mes, recordar que los meses empiezan en 0 (enero es 0)
    const año = fecha.getFullYear();  // Obtener el año

    return `${dia}-${mes}-${año}`;  // Formato dd-mm-yyyy
}