import { formatearFecha } from '@helpers/formatDate.js'
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
            if (time === "Hora") {
                x = ventas[ii].hora_compra
            }
            if (time === "Fecha") {
                x = formatearFecha(ventas[ii].fecha_compra)
            }
            if (time === "Mes") {
                x = ventas[ii].fecha_compra
            }
            if (time === "Año") {
                x = ventas[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": ventas[ii].ingresos_platillo
            }
            formatedVentas.push(obj);
        }
        if (time === "Mes") {
            truncarMes(obj)
        }
        if (time === "Año") {
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
            if (time === "Hora") {
                x = ventas[ii].hora_compra
            }
            if (time === "Fecha") {
                x = formatearFecha(ventas[ii].fecha_compra)
            }
            if (time === "Mes") {
                x = ventas[ii].fecha_compra
            }
            if (time === "Año") {
                x = ventas[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": ventas[ii].cantidad_platillo
            }
            formatedVentas.push(obj);
        }
        if (time === "Mes") {
            truncarMes(obj)
        }
        if (time === "Año") {
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
export function construirLinealCosto(datos, time) {
    //TODO: primero arregla costos para que lea los platillos
}
export function construirLinealStockUtensilios(datos, time) {
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
        const utensilio = datos[keys[i]]
        if (!utensilio || utensilio.length === 0) {
            continue
        }
        console.log("utensilio")
        console.log(utensilio)
        const utensilios = datos[keys[i]]
        let indice_color = 0;
        let formatedVentas = []
        for (let ii = 0; ii < utensilios.length; ii++) {
            if (time === "Hora") {
                x = utensilios[ii].hora_compra
            }
            if (time === "Fecha") {
                x = formatearFecha(utensilios[ii].fecha)
            }
            if (time === "Mes") {
                x = utensilios[ii].fecha_compra
            }
            if (time === "Año") {
                x = utensilios[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": utensilios[ii].cantidad_total
            }
            formatedVentas.push(obj);
        }
        if (time === "Mes") {
            truncarMes(obj)
        }
        if (time === "Año") {
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
export function construirStockIngredientes(datos, time) {
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
        console.log("datos construir")
        console.log(datos)
        const utensilio = datos[keys[i]]
        if (!utensilio || utensilio.length === 0) {
            continue
        }
        console.log("utensilio")
        console.log(utensilio)
        const utensilios = datos[keys[i]]
        let indice_color = 0;
        let formatedVentas = []
        for (let ii = 0; ii < utensilios.length; ii++) {
            if (time === "Hora") {
                x = utensilios[ii].hora_compra
            }
            if (time === "Fecha") {
                x = formatearFecha(utensilios[ii].fecha)
            }
            if (time === "Mes") {
                x = utensilios[ii].fecha_compra
            }
            if (time === "Año") {
                x = utensilios[ii].fecha_compra
            }
            const obj = {
                "x": x,
                "y": utensilios[ii].cantidad_total
            }
            formatedVentas.push(obj);
        }
        if (time === "Mes") {
            truncarMes(obj)
        }
        if (time === "Año") {
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
export function construirVentasPlatilloBarra(datos) {
    const color_barra = "hsl(299, 70%, 50%)"
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    let result = [];
    let keys = Object.keys(datos);
    for (let i = 0; i < keys.length; i++) {
        const ventas = datos[keys[i]]['ventas_por_comanda'];
        console.log("ventas")
        console.log(ventas)
        let total = 0;
        for (let ii = 0; ii < ventas.length; ii++) {
            const venta = ventas[ii];
            console.log("total")
            console.log(total)
            total += venta.cantidad_platillo;
        }
        console.log("total")
        console.log(total)
        const itemBar = {
            "nombre_platillo": keys[i],
            [keys[i]]: total,
            "color_barra": color_barra
        }
        result.push(itemBar);
    }
    return [result, keys];
}
export function construirPlatillosMenuBarra(datos) {
    console.log("datos menu")
    console.log(datos)
    const color_barra = "hsl(299, 70%, 50%)"
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    let keys = []
    let result = [];
    for (let i = 0; i < datos.length; i++) {
        const platillo_menu = datos[i]
        keys.push(platillo_menu.nombre_platillo)
        console.log("platillo_menu")
        console.log(platillo_menu)
        let total = 0;
        console.log("total")
        console.log(total)
        const itemBar = {
            "nombre_platillo": platillo_menu.nombre_platillo,
            [platillo_menu.nombre_platillo]: total,
            "color_barra": color_barra
        }
        result.push(itemBar);
    }
    return [result, keys];
}
export function construirVentasPlatilloCircular(datos) {
  const color_circular = "hsl(299, 70%, 50%)" //TODO: agregar una funcion para generar colores
  const keys = Object.keys(datos)
  let result = [];
  for (let i = 0; i < keys.length; i++) {
    console.log("datos")
    console.log(datos)
    const ventas = datos[keys[i]]["ventas_por_comanda"];
    let total = 0;
    for (let ii = 0; ii < ventas.length; ii++) {
      const venta = ventas[ii];
      total += venta.cantidad_platillo
    }
    const itemCircular = {
      "id": keys[i],
      "label": keys[i],
      "value": total,
      "color": color_circular
    }
    result.push(itemCircular)
  }
  return result;
}
export function construirPlatillosMenuCircular(datos) {
  const color_circular = "hsl(299, 70%, 50%)" //TODO: agregar una funcion para generar colores
  let result = [];
  for (let i = 0; i < datos.length; i++) {
    const platillo_menu = datos[i]
    console.log("datos")
    console.log(datos)
    const itemCircular = {
      "id": platillo_menu.nombre_platillo,
      "label": platillo_menu.nombre_platillo,
      "value": platillo_menu.menus.length,
      "color": color_circular
    }
    result.push(itemCircular)
  }
  return result;
}
function truncarMes(obj) {
    //TODO: sin implementar
}
function truncarAño(obj) {
    //TODO: sin implementar
}
function extraerHoraFecha(mfecha) {
    //TODO: sin implementar
}