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
            truncarMes_Test()
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
    return result;
}
export function construirLinealCosto(platillos, time) {
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
                x = utensilios[ii].fecha
            }
            if (time === "Año") {
                x = utensilios[ii].fecha
            }
            const obj_point = {
                "x": x,
                "y": utensilios[ii].cantidad_total
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
        const ingrediente = datos[keys[i]]
        if (!ingrediente || ingrediente.length === 0) {
            continue
        }
        const utensilios = datos[keys[i]]
        let indice_color = 0;
        let formatedLineData = []
        for (let ii = 0; ii < utensilios.length; ii++) {
            if (time === "Hora") {
                x = new Date(utensilios[ii].fecha)
                console.log(x)
                x = x.toTimeString()
                x = x.split(" ")[0]
            }
            if (time === "Fecha") {
                x = formatearFecha(utensilios[ii].fecha)
            }
            if (time === "Mes") {
                x = utensilios[ii].fecha
            }
            if (time === "Año") {
                x = utensilios[ii].fecha
            }
            const obj_punto = {
                "x": x,
                "y": utensilios[ii].cantidad_total
            }
            formatedLineData.push(obj_punto);
        }
        if (time === "Mes") {
            formatedLineData = truncarMes(formatedLineData)
        }
        if (time === "Año") {
            formatedLineData = truncarAño(formatedLineData)
        }
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
        let total = 0;
        const itemBar = {
            "nombre_platillo": platillo_menu.nombre_platillo,
            [platillo_menu.nombre_platillo]: total,
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
        return []
    }
    let newData = []
    if (data.length === 1) {
        const obj_point = {
            "x": new Date(data[0].x).getFullYear(),
            "y": data[0].y
        }
        newData.push(obj_point)
        return newData;
    }
    let nX = null
    let nY = data[0].y;
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
    //console.log("data de año")
    //console.log(data.length)
    if (data.length === 1) {
        //console.log("length 1")
        //let tmp = data[0].x
        //console.log(tmp)
        //tmp = new Date(tmp)
        //console.log(tmp)
        //tmp = tmp.getFullYear()
        //console.log(tmp)
        //console.log("fin revision")
        const obj_point = {
            "x": new Date(data[0].x).getFullYear(),
            "y": data[0].y
        }
        newData.push(obj_point)
        return newData;
    }
    //console.log("truncar año")
    //console.log(data)
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