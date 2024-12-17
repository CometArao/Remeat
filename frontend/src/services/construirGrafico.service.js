import { formatearFecha } from '@helpers/formatDate.js'
//TODO: pruebas

export function construirLinealPlatillosIngresos(datos, time) {
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
        const ventas = datos[keys[i]]['ventas_por_comanda'];
        let indice_color = 0;
        let formatedLineData = []
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
            const obj_point = {
                "x": x,
                "y": ventas[ii].ingresos_platillo
            }
            formatedLineData.push(obj_point);
        }
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
        const obj_line = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedLineData
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj_line);
    }
    ajustarEntradasDistintas(result)
    console.log("result")
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        result[i].data = ordenarHorasObjetos(result[i].data, false);
    }
    return result;
}
export function construirLinealPlatillosVentas(datos, time) {
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
        const ventas = datos[keys[i]]['ventas_por_comanda'];
        let indice_color = 0;
        let formatedLineData = []
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
            const obj_point = {
                "x": x,
                "y": ventas[ii].cantidad_platillo
            }
            formatedLineData.push(obj_point);
        }
        if (time === "Hora") {
            formatedLineData = ordenarHorasObjetos(formatedLineData)
            console.log("platillos venta ordenados")
            console.log(formatedLineData)
        }
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
        const obj_line = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedLineData
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj_line);
    }
    ajustarEntradasDistintas(result)
    console.log("result")
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        result[i].data = ordenarHorasObjetos(result[i].data, false);
    }
    return result;
}
export function construirLinealCosto(platillos, time) {
    console.log("datos")
    console.log(platillos)
    let x = null
    let result = [];
    //const keys = Object.keys(datos)
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    for (let i = 0; i < platillos.length; i++) {
        console.log("data[i]")
        console.log(platillos[i])
        const platillo = platillos[i];
        const comandas = platillo.comandas
        console.log("comandas")
        console.log(comandas)
        let indice_color = 0;
        let formatedLineData = []
        for (let ii = 0; ii < comandas.length; ii++) {
            const comanda = comandas[ii]
            console.log("comanda")
            console.log(comanda)
            if (time === "Hora") {
                x = comanda.hora_compra // TODO que hacer con las horas de mermas y pedidos
            }
            if (time === "Fecha") {
                x = formatearFecha(comanda.fecha)
            }
            if (time === "Mes") {
                x = comanda.fecha
            }
            if (time === "Año") {
                x = comanda.fecha
            }
            const obj_point = {
                "x": x,
                "y": comanda.costo
            }
            formatedLineData.push(obj_point);
        }
        //TODO: utilizar esta funcion para utilidades
        console.log("platillo")
        console.log(platillo)
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        const obj_line = {
            "id": platillo.nombre_platillo,
            "color": colores[indice_color],
            "data": formatedLineData
        }
        result.push(obj_line);
    }
    console.log("Construir datos resultado")
    console.log(result)
    //ajustarEntradasDistintas(result)
    //console.log("result")
    //console.log(result)
    //for (let i = 0; i < result.length; i++) {
        //result[i].data = ordenarHorasObjetos(result[i].data, false);
    //}
    return result;
}
export function construirLinealUtilidades(platillos, time) {
    //TODO: primero arregla costos para que lea los platillos
    console.log("datos")
    console.log(platillos)
    let x = null
    let result = [];
    //const keys = Object.keys(datos)
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    for (let i = 0; i < platillos.length; i++) {
        console.log("data[i]")
        console.log(platillos[i])
        const platillo = platillos[i];
        const comandas = platillo.comandas
        console.log("comandas")
        console.log(comandas)
        for (let ii = 0; ii < comandas.length; ii++) {
            const comanda = comandas[ii]
            console.log("comanda")
            console.log(comanda)
            let indice_color = 0;
            let formatedLineData = []
            if (time === "Hora") {
                x = comanda.hora_compra
            }
            if (time === "Fecha") {
                x = formatearFecha(comanda.fecha)
            }
            if (time === "Mes") {
                x = comanda.fecha
            }
            if (time === "Año") {
                x = comanda.fecha
            }
            const obj_point = {
                "x": x,
                "y": comanda.utilidad
            }
            formatedLineData.push(obj_point);
            if (time === "Mes") {
                formatedLineData = truncarMes(formatedLineData)
            }
            if (time === "Año") {
                formatedLineData = truncarAño(formatedLineData)
            }
            const obj_line = {
                "id": platillo.nombre_platillo,
                "color": colores[indice_color],
                "data": formatedLineData
            }
            indice_color++;
            if (indice_color === colores.length) {
                indice_color = 0;
            }
            result.push(obj_line);
        }
    }
    console.log("Construir datos resultado")
    console.log(result)
    ajustarEntradasDistintas(result)
    console.log("result")
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        result[i].data = ordenarHorasObjetos(result[i].data, false);
    }
    return result;
}
export function construirLinealStockUtensilios(datos, time) {
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
        const utensilio = datos[keys[i]]
        if (!utensilio || utensilio.length === 0) {
            continue
        }
        const utensilios = datos[keys[i]]
        let indice_color = 0;
        let formatedLineData = []
        for (let ii = 0; ii < utensilios.length; ii++) {
            if (time === "Hora") {
                x = new Date(utensilios[ii].fecha)
                console.log("x")
                console.log(x)
                x = x.toTimeString()
                x = x.split(" ")[0]
                console.log(x)
            }
            if (time === "Fecha") {
                x = formatearFecha(utensilios[ii].fecha)
            }
            if (time === "Mes") {
                x = String((new Date(utensilios[ii].fecha).getMonth() + 1)).padStart(2, '0');
            }
            if (time === "Año") {
                x = String((new Date(utensilios[ii].fecha)).getFullYear());
            }
            if (!utensilios[ii].evento) {
                utensilios[ii].evento = "otro"
            }
            const obj_point = {
                "x": x,
                "y": utensilios[ii].cantidad_total,
                "dy": utensilios[ii].cantidad_utensilio,
                "tipo": utensilios[ii].evento
            }
            formatedLineData.push(obj_point);
        }
        formatedLineData = eliminarRepetidos(formatedLineData)
        console.log("despues de eliminar repetidas")
        console.log(formatedLineData)
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
        const obj_line = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedLineData
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj_line);
    }
    ajustarEntradasDistintas(result)
    console.log("result")
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        result[i].data = ordenarHorasObjetos(result[i].data, true);
    }
    return result;
}
export function construirStockIngredientes(datos, time) {
    console.log("Construir stock ingredientes")
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
        const ingrediente = datos[keys[i]]
        if (!ingrediente || ingrediente.length === 0) {
            continue
        }
        const ingrediente_dato = datos[keys[i]]
        let indice_color = 0;
        let formatedLineData = []
        for (let ii = 0; ii < ingrediente_dato.length; ii++) {
            if (time === "Hora") {
                if (ingrediente_dato[ii].tipo === "comanda") {
                    console.log("hora?")
                    console.log(ingrediente_dato[ii])
                    x = ingrediente_dato[ii].hora
                } else {
                    x = new Date(ingrediente_dato[ii].fecha)
                    console.log(x)
                    x = x.toTimeString()
                    x = x.split(" ")[0]
                }
            }
            if (time === "Fecha") {
                x = formatearFecha(ingrediente_dato[ii].fecha)
            }
            if (time === "Mes") {
                x = String((new Date(ingrediente_dato[ii].fecha).getMonth() + 1)).padStart(2, '0');
            }
            if (time === "Año") {
                x = String((new Date(ingrediente_dato[ii].fecha)).getFullYear());
            }
            const obj_punto = {
                "x": x,
                "y": ingrediente_dato[ii].cantidad_total,
                "tipo": ingrediente_dato[ii].tipo
            }
            formatedLineData.push(obj_punto);
        }
        formatedLineData = eliminarRepetidos(formatedLineData)
        console.log("formatedLineData")
        console.log(formatedLineData)
        if (time === "Hora") {
            formatedLineData = ordenarHorasObjetos(formatedLineData)
        }
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
        console.log("formatedLineData despues truncar")
        console.log(formatedLineData)
        const obj_linea = {
            "id": keys[i],
            "color": colores[indice_color],
            "data": formatedLineData
        }
        indice_color++;
        if (indice_color === colores.length) {
            indice_color = 0;
        }
        result.push(obj_linea);
    }
    console.log("final construir ingredientes")
    console.log(result)
    ajustarEntradasDistintas(result)
    console.log("result")
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        result[i].data = ordenarHorasObjetos(result[i].data, true);
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
        let total = 0;
        for (let ii = 0; ii < ventas.length; ii++) {
            const venta = ventas[ii];
            total += venta.cantidad_platillo;
        }
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
    let keys = []
    let result = [];
    for (let i = 0; i < datos.length; i++) {
        const color_barra = getColor(i)
        const platillo_menu = datos[i]
        keys.push(platillo_menu.nombre_platillo)
        console.log("platillo_menu")
        console.log(platillo_menu)
        const itemBar = {
            "nombre_platillo": platillo_menu.nombre_platillo,
            [platillo_menu.nombre_platillo]: platillo_menu.menu.length,
            "color_barra": color_barra
        }
        result.push(itemBar);
    }
    return [result, keys];
}
export function construirVentasPlatilloCircular(datos, time) {
    const keys = Object.keys(datos)
    let result = [];
    for (let i = 0; i < keys.length; i++) {
        const color_circular = getColor(i)
        const ventas = datos[keys[i]]["ventas_por_comanda"];
        let today = null;
        let total = 0;
        for (let ii = 0; ii < ventas.length; ii++) {
            const venta = ventas[ii];
            if (time === "Dia") {
                today = formatearFecha(new Date())
                const fechaVenta = formatearFecha(venta.fecha_compra);
                console.log("today")
                console.log(today)
                console.log("fechaVenta")
                console.log(fechaVenta)
                if (today === fechaVenta) {
                    total += venta.cantidad_platillo
                }
            }
            if (time === "Mes") {
                today = new Date()
                const today_mes = today.getMonth()
                const today_año = today.getFullYear()
                const fechaVenta = new Date(venta.fecha_compra);
                const venta_mes = fechaVenta.getMonth()
                const venta_año = fechaVenta.getFullYear()
                if (today_mes === venta_mes
                    &&
                    today_año === venta_año) {

                    total += venta.cantidad_platillo
                }
            }
            if (time === "Año") {
                today = new Date()
                const fechaVenta = new Date(venta.fecha_compra);
                const venta_año = fechaVenta.getFullYear()
                const today_año = today.getFullYear()
                if (venta_año === today_año) {
                    total += venta.cantidad_platillo
                }
            }
            if (time === "Total") {
                total += venta.cantidad_platillo
            }
        }
        const itemCircular = {
            "id": keys[i],
            "label": keys[i],
            "value": total,
            "color": color_circular
        }
        result.push(itemCircular)
    }
    console.log("result")
    console.log(result)
    return [result, keys];
}
export function construirPlatillosMenuCircular(datos, time) {
    console.log("datos")
    console.log(datos)
    let result = [];
    for (let i = 0; i < datos.length; i++) {
        const color_circular = getColor(i)
        const platillo_menu = datos[i]
        if (time === "Total") {
            const itemCircular = {
                "id": platillo_menu.nombre_platillo,
                "label": platillo_menu.nombre_platillo,
                "value": platillo_menu.menu.length,
                "color": color_circular
            }
            result.push(itemCircular)
        }
        if (time === "Año") {
            const today = new Date()
            const todayAño = today.getFullYear()
            let menuCount = 0;
            for (let ii = 0; ii < platillo_menu.menu.length; ii++) {
                const menu = platillo_menu.menu[ii];
                const fecha_menu = new Date(menu.fecha)
                const menuAño = fecha_menu.getFullYear()
                if (menuAño === todayAño) {
                    menuCount++;
                }
            }
            const itemCircular = {
                "id": platillo_menu.nombre_platillo,
                "label": platillo_menu.nombre_platillo,
                "value": menuCount,
                "color": color_circular
            }
            result.push(itemCircular)
        }
        if (time === "Mes") {
            const today = new Date()
            const todayAño = today.getFullYear()
            const todayMes = today.getMonth()
            let menuCount = 0;
            for (let ii = 0; ii < platillo_menu.menu.length; ii++) {
                const menu = platillo_menu.menu[ii];
                const fecha_menu = new Date(menu.fecha)
                const menuAño = fecha_menu.getFullYear()
                const menuMes = fecha_menu.getMonth()
                if (menuAño === todayAño && menuMes === todayMes) {
                    menuCount++;
                }
            }
            const itemCircular = {
                "id": platillo_menu.nombre_platillo,
                "label": platillo_menu.nombre_platillo,
                "value": menuCount,
                "color": color_circular
            }
            result.push(itemCircular)

        }
        if (time === "Dia") {
            let today = new Date()
            today = new Date() //TODO: como se ponia la fecha correcta
            console.log("today")
            console.log(today)
            const todayAño = today.getFullYear()
            const todayMes = today.getMonth()
            const todayDia = today.getUTCDate()
            let menuCount = 0;
            for (let ii = 0; ii < platillo_menu.menu.length; ii++) {
                const menu = platillo_menu.menu[ii];
                const fecha_menu = new Date(menu.fecha)
                const menuAño = fecha_menu.getFullYear()
                const menuMes = fecha_menu.getMonth()
                const menuDia = fecha_menu.getUTCDate()
                console.log(today)
                console.log(fecha_menu)
                console.log(menuAño === todayAño)
                console.log(menuMes === todayMes)
                console.log(menuDia === todayDia)
                console.log(menuDia)
                console.log(todayDia)
                if (menuAño === todayAño && menuMes === todayMes && menuDia === todayDia) {
                    menuCount++;
                }
            }
            const itemCircular = {
                "id": platillo_menu.nombre_platillo,
                "label": platillo_menu.nombre_platillo,
                "value": menuCount,
                "color": color_circular
            }
            result.push(itemCircular)
        }
    }
    return result;
}
function truncarMes(data) {
    console.log("Trucar Mes")
    console.log(data)
    const meses = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
    };
    if (data.length === 0) {
        console.log("is empty")
        return []
    }
    let newData = []
    if (data.length === 1) {
        let nXDate = String((new Date(data[0].x).getMonth() + 1)).padStart(2, '0');
        const obj_point = {
            "x": meses[nXDate],
            "y": data[0].y
        }
        newData.push(obj_point)
        console.log(newData)
        return newData;
    }
    let nX = null
    let nY = null;
    if (data[0].dy) {
        nY = data[0].dy
    }
    nY = data[0].y;
    let prevX = null
    let nXDate = null
    for (let i = 1; i < data.length; i++) {
        prevX = data[i - 1].x
        nX = data[i].x
        let prevDate = new Date(prevX);
        prevDate = String(prevDate.getMonth() + 1).padStart(2, '0');
        nXDate = new Date(nX);
        nXDate = String(nXDate.getMonth() + 1).padStart(2, '0');
        if (prevDate === nXDate) {
            if (data[0].dy) {
                if (data[0].tipo === "merma") {
                    nY -= data[i].dy
                } else {
                    nY += data[i].dy
                }
            }
            nY += data[i].y
        } else {
            const obj_point = {
                "x": meses[prevDate],
                "y": nY
            }
            newData.push(obj_point);
            nY = null
            if (i === data.length - 1) {
                const obj_point = {
                    "x": meses[nXDate],
                    "y": data[i].y
                }
                newData.push(obj_point);
                nY = null
            }
        }
    }
    if (nY !== null) {
        const obj_point = {
            "x": meses[nXDate],
            "y": nY
        }
        newData.push(obj_point);
    }
    console.log("newData")
    console.log(newData)
    return newData
}
function truncarMes_Test() {
    let newData = truncarMes([]);
    if (newData.length === 0) {
        console.log("truncarMes([]) Bien")
    } else {
        console.log("truncarMes([]) Mal")
    }
    newData = truncarMes([
        {
            "x": "2023-12-21",
            "y": 100
        },
        {
            "x": "2023-12-22",
            "y": 100
        }
    ])
    if (newData.length == 1 && newData[0].y === 200) {
        console.log("truncarMes(2) Bien")
    } else {
        console.log("truncarMes(2) Mal")
    }
    console.log(newData)
    newData = truncarMes([
        {
            "x": "2023-12-21",
            "y": 100
        },
        {
            "x": "2023-12-22",
            "y": 100
        },
        {
            "x": "2024-01-22",
            "y": 100
        }
    ])
    if (newData.length == 2 && newData[0].y === 200 && newData[1].y === 100) {
        console.log("truncarMes(3) Bien")
    } else {
        console.log("truncarMes(3) Mal")
    }
    console.log(newData)
}
function truncarAño(data) {
    //TODO: sin implementar
    if (data.length === 0) {
        return []
    }
    let newData = []
    if (data.length === 1) {
        console.log("new date¿?")
        //console.log(data[0].x)
        //console.log(new Date(data[0].x, 0, 1))
        //console.log(new Date(data[0].x, 0, 1).getFullYear())
        const obj_point = {
            //los argumentos son para asegurarse de que no se aproxime la fecha a el año anterior
            "x": getYear(data[0].x),    //new Date(data[0].x, 0, 1).getFullYear(),
            "y": data[0].y
        }
        newData.push(obj_point)
        return newData;
    }
    let nX = null;
    let nY = data[0].y;
    let prevX = null;
    let nXDate = null;
    for (let i = 1; i < data.length; i++) {
        prevX = data[i - 1].x
        nX = data[i].x
        let prevDate = new Date(prevX);
        prevDate = String(prevDate.getFullYear());
        nXDate = new Date(nX);
        nXDate = String(nXDate.getFullYear());
        if (prevDate === nXDate) {
            nY += data[i].y
        } else {
            const obj_point = {
                "x": prevDate,
                "y": nY
            }
            newData.push(obj_point);
            nY = null
            if (i === data.length - 1) {
                const obj_point = {
                    "x": nXDate,
                    "y": data[i].y
                }
                newData.push(obj_point);
                nY = null
            }
        }
    }
    if (nY !== null) {
        console.log(nXDate)
        const obj_point = {
            "x": nXDate,
            "y": nY
        }
        newData.push(obj_point);
    }
    console.log("truncar año fin")
    console.log(newData)
    return newData;
}
//function extraerHoraFecha(mfecha) {
////TODO: sin implementar
//creo que no nesesito esta funcion
//}

function getColor(i) {
    const colores = [
        "hsl(308, 70%, 50%)",
        "hsl(149, 70%, 50%)",
        "hsl(63, 70%, 50%)",
        "hsl(155, 70%, 50%)",
        "hsl(200, 70%, 50%)"
    ]
    const color_index = i % colores.length;
    return colores[color_index]
}

export function idsCosto(ids) {
    console.log("idsCosto")
    console.log(ids)
    const nuevasIds = [];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        id = id.split("_")
        id = id[1]
        nuevasIds.push(id);
    }
    return nuevasIds;
}
function eliminarRepetidos(data, time) {
    console.log("eliminar repetidos")
    console.log(data)
    let newData = []
    let obj_point = data[0];
    let sobraUno = true;
    if (data.length === 1) {
        newData.push(obj_point)
        return newData;
    }
    let new_obj_point = {
        "x": obj_point.x,
        "y": obj_point.y
    };
    for (let i = 1; i < data.length; i++) {
        let obj_point_next = data[i];

        if (obj_point.x === obj_point_next.x) {
            if (obj_point_next.tipo === "merma" || obj_point_next.tipo === "comanda") {
                new_obj_point.y -= obj_point_next.y
            } else {
                new_obj_point.y += obj_point_next.y
            }
            console.log("new obj point")
            console.log(new_obj_point)
            sobraUno = false;
        } else {
            newData.push(new_obj_point)
            new_obj_point = {
                "x": obj_point_next.x,
                "y": obj_point_next.y
            };
            sobraUno = true;
        }
        obj_point = obj_point_next;
    }
    if (sobraUno) {
        new_obj_point = {
            "x": obj_point.x,
            "y": obj_point.y
        };
        newData.push(new_obj_point)
    } else {
        //Si no sobra uno siempre queda un elemento
        newData.push(new_obj_point)
    }
    return newData;
}
function ordenarHoras(data) {
    console.log("ordenar horas")
    console.log(data)

    const listaOrdenada = data.sort((a, b) => {
        console.log("a")
        console.log(a)
        const aGroup = a.split(":")
        const bGroup = b.split(":")
        const AtimeX = aGroup[0] * 3600 + aGroup[1] * 60 + aGroup[2]
        const BtimeX = bGroup[0] * 3600 + bGroup[1] * 60 + bGroup[2]
        if (AtimeX < BtimeX) {
            return -1;
        }
        if (AtimeX > BtimeX) {
            return 1;
        }
        return 0;
    })
    console.log(listaOrdenada)
    return listaOrdenada;
}
export function ordenarHorasObjetos(data) {
    console.log("ordenar horas")
    console.log(data)

    const listaOrdenada = data.sort((a, b) => {
        console.log("a.x")
        console.log(a.x)
        const aGroup = a.x.split(":")
        const bGroup = b.x.split(":")
        const AtimeX = aGroup[0] * 3600 + aGroup[1] * 60 + aGroup[2]
        const BtimeX = bGroup[0] * 3600 + bGroup[1] * 60 + bGroup[2]
        if (AtimeX < BtimeX) {
            return -1;
        }
        if (AtimeX > BtimeX) {
            return 1;
        }
        return 0;
    })
    console.log(listaOrdenada)
    return listaOrdenada;
}
function getYear(year) {
    if (year.length === 4) {
        return new Date(year, 0, 1).getFullYear()
    } else {
        return String(new Date(year).getFullYear())
    }
}

export function ajustarEntradasDistintas(objLines, mantener) {
    console.log("ajustarEntradasDistintas")
    console.log(objLines)
    let dictionaryOfXs = {}
    let listOfDictionaryOfObject = []
    //Primero agregar todas las x a la tabla
    for (let i = 0; i < objLines.length; i++) {
        const objLine = objLines[i];
        const dataOfLine = objLine.data;
        let dictionaryOfObj = {}
        for (let ii = 0; ii < dataOfLine.length; ii++) {
            const objPoint = dataOfLine[ii];
            //Agregar todas las x de del objeto linea al dict
            dictionaryOfObj[objPoint.x] = objPoint.y;
            if (!dictionaryOfXs[objPoint.x]) {
                dictionaryOfXs[objPoint.x] = objPoint.y
            }
        }
        listOfDictionaryOfObject.push(dictionaryOfObj);
    }
    //Asegurarse de que todas las lineas tengan todas las X
    console.log("test")
    console.log(Object.keys(dictionaryOfXs))
    const listOfXs = Object.keys(dictionaryOfXs).sort((a, b) => {
        console.log("a.x")
        console.log(a)
        const aGroup = a.split(":")
        const bGroup = b.split(":")
        const AtimeX = aGroup[0] * 3600 + aGroup[1] * 60 + aGroup[2]
        const BtimeX = bGroup[0] * 3600 + bGroup[1] * 60 + bGroup[2]
        if (AtimeX < BtimeX) {
            return -1;
        }
        if (AtimeX > BtimeX) {
            return 1;
        }
        return 0;
    })
    console.log("listOfX")
    console.log(listOfXs)

    console.log("listOfDictionary")
    console.log(listOfDictionaryOfObject)

    for (let i = 0; i < listOfDictionaryOfObject.length; i++) {
        const dictionaryOfObject = listOfDictionaryOfObject[i];
        let objLine = objLines[i]
        let data = objLine.data;
        let lastNonNullValue = 0;
        for (let ii = 0; ii < listOfXs.length; ii++) {
            console.log("dict")
            console.log(dictionaryOfObject)
            const x = listOfXs[ii]
            console.log("x")
            console.log(x)
            if (!dictionaryOfObject[x]) {
                if (ii - 1 < 0 || !mantener) {
                    data.push({ x: x, y: 0 });
                } else {
                    data.push({ x: x, y: lastNonNullValue });
                }
            } else {
                console.log("lastnonnull")
                console.log(dictionaryOfObject[x])
                lastNonNullValue = dictionaryOfObject[x]
            }
        }
        console.log("data")
        console.log(data)
    }
    console.log("ajustar")
    console.log(objLines)
}