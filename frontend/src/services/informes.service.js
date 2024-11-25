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