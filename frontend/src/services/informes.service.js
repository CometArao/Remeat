import axios from './root.service.js'

export async function getVentasPlatillo(ids_platillo) {
    try {
        ids_platillo = { ids: ids_platillo }
        console.log("ids_platillo")
        console.log(ids_platillo)
        const response = await axios({
            method: 'post', // Establecer explícitamente el método GET
            url: '/informes/get_ingresos_venta',
            data: ids_platillo,  // Incluir el cuerpo (aunque no es estándar)
            headers: { 'Content-Type': 'application/json' }
        })
        console.log("response")
        console.log(response)
        //const { data } = await axios.get('/informes/get_ingresos_venta', ids_platillo)
        return response.data.data;
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}
export async function getCostosNormal(ids_tipo_ingrediente, ids_tipo_utensilio) {
    try {
        const body = {
            ids_ti: ids_tipo_ingrediente,
            ids_tu: ids_tipo_utensilio
        }
        const { data } = await axios.post(`/informes/get_costos/normal`, body);
        return data.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}
export async function getCostosPlatillo(ids_platillo) {
    try {
        const body = {
            ids_platillo: ids_platillo,
        }
        const { data } = await axios.post(`/informes/get_costos`, body);
        return data.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}
export async function getStockUtensilio(ids_tipo_utensilio) {
    try {
        const body = {
            ids: ids_tipo_utensilio
        }
        const { data } = await axios.post(`/informes/get_stock_utensilio`, body)
        return data.data
    }catch(error) {
        console.error(error)
        return error.response.data
    }
}
export async function getStockIngrediente(ids_tipo_ingrediente) {
    try {
        const body = {
            ids: ids_tipo_ingrediente
        }
        const { data } = await axios.post(`/informes/get_stock_ingrediente`, body)
        return data.data
    }catch(error) {
        console.error(error)
        return error.response.data
    }
}
export async function getPlatilloMenu(ids_platillo) {
    try {
        const body = {
            ids: ids_platillo
        }
        const { data } = await axios.post(`/informes/get_platillo_menu`, body)
        return data.data
    }catch(error) {
        console.error(error)
        return error.response.data
    }
}
export async function getVentas(ids_tipo_ingrediente, ids_tipo_utensilio) {
    try {
        const body = {
            ids_ti: ids_tipo_ingrediente,
        }
        const { data } = await axios.post(`/informes/ventas`, body)
        return data.data
    }catch(error) {
        console.error(error)
        return error.response.data
    }
}
export async function getUtilidades(ids_tipo_ingrediente, ids_tipo_utensilio) {
    try {
        const body = {
            ids_ti: ids_tipo_ingrediente,
            ids_tu: ids_tipo_utensilio
        }
        const { data } = await axios.post(`/informes/get_ventas_tipo`, body)
        return data.data
    }catch(error) {
        console.error(error)
        return error.response.data
    }
}