import { useState, useRef } from 'react';
import { getPlatillos } from '../services/platillos.service';
import { getTiposIngrediente } from '@services/ingredientes.service.js'
import TableWithCheckboxes from '@components/TableWithCheckboxes';
import SelectTime from '@components/SelectTime'
import '@styles/informe.css';
import { showErrorAlert } from '@helpers/sweetAlert.js';
import { useNavigate } from 'react-router-dom';
import {
    getVentasPlatillo, getCostos,
    getStockUtensilio, getStockIngrediente,
    getPlatilloMenu,
    getVentas, getUtilidades
} from '@services/informes.service.js'
import { getIngredientes } from '../services/ingredientes.service';
import { getTiposUtensilio } from '../services/utensilio.service';
import { construirLinealPlatillosIngresos, construirLinealPlatillosVentas } from '../services/construirGrafico.service'

/**
 * Esta pagina para seleccionar el grafico y las variables a usar
 */

const tiempo_lineal = [
    {
        id: 0,
        name: "Fecha"
    },
    {
        id: 1,
        name: "Hora"
    },
    {
        id: 2,
        name: "Mes"
    },
    {
        id: 3,
        name: "Año"
    },
]
const tiempo_circular = [
    {
        id: 1,
        name: "Dia"
    },
    {
        id: 2,
        name: "Mes"
    },
    {
        id: 3,
        name: "Año"
    },
    {
        id: 4,
        name: "Total"
    },
]



const Informes = () => {
    const navigate = useNavigate();
    const [datosDependientes, setDatosDependientes] =
        useState([{ id: -1, name: 'Seleccione un tipo de grafico primero' }])
    const [datosIndependientes, setDatosIndependientes] =
        useState([{ id: -1, name: 'Seleccione un tipo de grafico primero' }])
    const [tipoGrafico, setTipoGrafico] =
        useState(null)
    const [selectedItems, setSelectedItems] =
        useState(["item"])
    const [selectedTime, setSelectedTime] =
        useState(["time"])
    const SelectedItemsRef = useRef();
    const SelectedTimeRef = useRef();

    const handleSelectedItems = () => {
        const selected = SelectedItemsRef.current.getSelectedItems()
        console.log("selected")
        console.log(selected)
        setSelectedItems(selected);
        return selected;
    }
    const handleSelectedTime = () => {
        const selectedTime = SelectedTimeRef.current.getSelectedTime()
        setSelectedTime(selectedTime)
        return selectedTime;
    }
    /*

    #############################
    // Handlers de Lineal
    ############################

    */
    const handleClickVentas = async () => {
        try {
            const ventasPlatillos = await getPlatillos();
            //No se envia un pop con la alerta porque queda feo
            console.log(ventasPlatillos)
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            console.log(formatedPlatillos)
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({ tipoGrafico: "lineal", variable: "ingresos_ventas_platillo" })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            console.error('Error al buscar los platos:', error);
            showErrorAlert('Error, No se pudieron encontrar los platos');
        }
    }
    const handleClickCosto = async () => {
        try {
            const ingredientes = await getTiposIngrediente();
            const utensilios = await getTiposUtensilio();
            let formatedList = [];
            for (let i = 0; i < ingredientes.length; i++) {
                const ingrediente = ingredientes[i];
                const IngredienteFormatedData = {
                    id: ingrediente.id_tipo_ingrediente,
                    name: ingrediente.nombre_tipo_ingrediente,
                    tipo: "ingrediente"
                }
                formatedList.push(IngredienteFormatedData)
                const utensilio = utensilios[i];
                const utensilioFormatedData = {
                    id: utensilio.id_tipo_utensilio,
                    name: utensilio.nombre_tipo_utensilio,
                    tipo: "utensilio"
                }
                formatedList.push(utensilioFormatedData)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "lineal", variable: "costos" })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert("Error no se pudo encontrar los ingredientes y utensilios")
        }
    }
    const handleClickUtilidades = async () => {
        try {
            const ingredientes = await getTiposIngrediente();
            const utensilios = await getTiposUtensilio();
            let formatedList = [];
            for (let i = 0; i < ingredientes.length; i++) {
                const ingrediente = ingredientes[i];
                const IngredienteFormatedData = {
                    id: ingrediente.id_tipo_ingrediente,
                    name: ingrediente.nombre_tipo_ingrediente,
                    tipo: "ingrediente"
                }
                formatedList.push(IngredienteFormatedData)
                const utensilio = utensilios[i];
                const utensilioFormatedData = {
                    id: utensilio.id_tipo_utensilio,
                    name: utensilio.nombre_tipo_utensilio,
                    tipo: "utensilio"
                }
                formatedList.push(utensilioFormatedData)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "lineal", variable: "utilidades" })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert("Error no se pudo encontrarse los ingredientes y utensilios")
        }

    }
    const handleStockUtensilios = async () => {
        try {
            const utensilios = await getTiposUtensilio();
            let formatedList = [];
            for (let i = 0; i < utensilios.length; i++) {
                const utensilio = utensilios[i];
                const formatedUtensilio = {
                    id: utensilio.id_tipo_utensilio,
                    name: utensilio.nombre_tipo_utensilio
                }
                formatedList.push(formatedUtensilio)
            }
            console.log("formated List")
            console.log(formatedList)
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "lineal", variable: "stock_utensilios" })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert("Error no se pudo encontrar los utensilios")
        }
    }
    const handleStockIngredientes = async () => {
        try {
            const ingredientes = await getTiposIngrediente();
            let formatedList = [];
            for (let i = 0; i < ingredientes.length; i++) {
                const ingrediente = ingredientes[i];
                const formatedIngrediente = {
                    id: ingrediente.id_tipo_ingrediente,
                    name: ingrediente.nombre_tipo_ingrediente
                }
                formatedList.push(formatedIngrediente)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "lineal", variable: "stock_ingredientes" })
            setDatosIndependientes(tiempo_lineal)

        } catch (error) {
            console.log(error)
            showErrorAlert("Error no se pudo encontrar ingredientes")
        }

    }
    //Este metodo se ejecuta al presionar el boton de ventas platillo
    //Este metodo llama a la backend por la informacion de ventas platillo
    const handleClickVentasPlatilloLineal = async () => {
        try {
            const ventasPlatillos = await getPlatillos();
            //No se envia un pop con la alerta porque queda feo
            console.log(ventasPlatillos)
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            console.log(formatedPlatillos)
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({ tipoGrafico: "lineal", variable: "ventas_platillo" })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            console.error('Error al buscar los platos:', error);
            showErrorAlert('Error, No se pudieron encontrar los platos');
        }
    }
    /*

    #############################
    // Handlers de Barra
    ############################

    */
    const handleClickVentasPlatilloBarra = async () => {
        try {
            const ventasPlatillos = await getPlatillos();
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            console.log(formatedPlatillos)
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({ tipoGrafico: "barra", variable: "ventas_platillo" })
            setDatosIndependientes([{ id: 1, name: "No Aplica" }])
        } catch (error) {
            console.log(error);
            console.error('Error al buscar los platos:', error)
            showErrorAlert("Error, No se pudieron encontrar los platos")
        }
    }
    const handlePlatilloMenuBarra = async () => {
        try {
            const Platillos = await getPlatillos();
            let formatedList = [];
            for (let i = 0; i < Platillos.length; i++) {
                const platillo = Platillos[i];
                const formatedData = {
                    id: platillo.id_platillo,
                    name: platillo.nombre_platillo
                }
                formatedList.push(formatedData)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "barra", variable: "platillo_menu" })
            setDatosIndependientes([{ id: 1, name: "No aplica" }])
        } catch (error) {
            console.log(error);
            console.error('Error al buscar los platos:', error)
            showErrorAlert("Error, No se pudieron encontrar los platos")
        }
    }
    /*

    ############################
    // Handlers de Circular
    ############################

    */
    const handleClickVentasPlatilloCircular = async () => {
        try {
            const ventasPlatillos = await getPlatillos();
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            console.log(formatedPlatillos)
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({ tipoGrafico: "circular", variable: "ventas_platillo" })
            setDatosIndependientes(tiempo_circular)
        } catch (error) {
            console.log(error);
            console.error('Error al buscar los platos:', error)
            showErrorAlert("Error, No se pudieron encontrar los platos")
        }
    }
    const handlePlatilloMenuCircular = async () => {
        try {
            const Platillos = await getPlatillos();
            let formatedList = [];
            for (let i = 0; i < Platillos.length; i++) {
                const platillo = Platillos[i];
                const formatedData = {
                    id: platillo.id_platillo,
                    name: platillo.nombre_platillo
                }
                formatedList.push(formatedData)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({ tipoGrafico: "barra", variable: "platillo_menu"})
            setDatosIndependientes([{ id: 1, name: "No aplica" }])
        }catch(error) {
            console.log(error)
            console.error("Error al buscar los platos", error)
            showErrorAlert("Error, no se pudieron encontrar los platos")
        }
    }
    const handleNavigation = async () => {
        if (!tipoGrafico) {
            showErrorAlert('Error, Debe seleccionar un tipo de grafico');
            return;
        }
        const selectedItems = handleSelectedItems();
        const selectedTime = handleSelectedTime();
        console.log("selected items")
        console.log(selectedItems)
        //Comprobar elementos seleccionados
        if (!selectedItems || selectedItems[0].id == -1) {
            showErrorAlert('Error, Debe seleccionar en la checklist de items')
            return;
        }
        if ((!selectedTime || selectedTime.id == -1) && tipoGrafico.tipoGrafico != "barra") {
            showErrorAlert('Error, Debe seleccionar en la checklist de tiempo')
            return;
        }
        let ids = []
        for (let i = 0; i < selectedItems.length; i++) {
            ids.push(selectedItems[i].id)
        }
        //llamar dependiendo del tipo de grafico TODO:
        let datos = null;
        switch(tipoGrafico.variable) {
            case "ventas_platillo":
                const ventas_platillo =
                    await getVentasPlatillo(ids);
                console.log("selectedTime")
                console.log(selectedTime)
                const formatedData =
                construirLinealPlatillosVentas(ventas_platillo, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedData,
                    tipo: tipoGrafico
                }
                break;
            case "ingresos_ventas_platillo":
                const ingresos_ventas_platillo =
                    await getVentasPlatillo(ids);
                console.log("selectedTime")
                console.log(selectedTime)
                const formatedDependiente = 
                construirLinealPlatillosIngresos(ingresos_ventas_platillo, selectedTime.name);
                console.log("formatedDependiente")
                console.log(formatedDependiente)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico,
                }
                break;
            case "costos":
                const costos = await getCostos(ids) //ids separadas
                datos = {
                    independientes: selectedTime,
                    dependientes: costos,
                    tipo: tipoGrafico
                }
                break;
            case "utilidades":
                //const utilidades TODO:
                break;
            case "stock_utensilio":
                const stock_utensilio = await getStockUtensilio(ids)
                datos = {
                    independientes: selectedTime,
                    dependientes: stock_utensilio,
                    tipo: tipoGrafico
                }
                break;
            case "stock_ingredientes":
                const stock_ingredientes = await getStockIngrediente(ids)
                datos = {
                    independientes: selectedTime,
                    dependientes: stock_ingredientes,
                    tipo: tipoGrafico
                }//TODO: Los graficos de barra y circular
                break;
            default:
                showErrorAlert('default error ¿?')
                return
        }
        console.log("antes de enviar")
        console.log(datos)
        console.log("dependientes")
        console.log(datos.dependientes)
        console.log(datos.dependientes.length)
        const dependientes_keys = Object.keys(datos.dependientes)
        if (datos.length == 0 || dependientes_keys.length == 0 || !datos.dependientes) {
            showErrorAlert('Error, parece que los platillos seleccionados no tienen suficiente informacion')
            return
        }
        navigate('/grafico', { state: datos });
    }

    return (
        <div className="main-container">
            <h1>Seleccione El Grafico</h1>
            <div className="graficos-container">
                {/* Sección de gráficos de línea */}
                <section className="grafico-section">
                    <h2>Linea</h2>
                    <div className="botones">
                        <button onClick={handleClickVentas}>Ventas</button>
                        <button onClick={handleClickCosto}>Costo</button>
                        <button onClick={handleClickUtilidades}>Utilidades</button>
                        <button onClick={handleStockUtensilios}>Stock Utensilios</button>
                        <button onClick={handleStockIngredientes}>Stock Ingredientes</button>
                        <button onClick={handleClickVentasPlatilloLineal}>Ventas Platillos</button>
                    </div>
                </section>

                {/* Sección de gráficos de barra */}
                <section className="grafico-section">
                    <h2>Barra</h2>
                    <div className="botones">
                        <button onClick={handleClickVentasPlatilloBarra}>Ventas Platillos</button>
                        <button onClick={handlePlatilloMenuBarra}>Platillos en el Menu</button>
                    </div>
                </section>

                {/* Sección de gráficos circulares */}
                <section className="grafico-section">
                    <h2>Circular</h2>
                    <div className="botones">
                        <button onClick={handleClickVentasPlatilloCircular}>Ventas Platillos</button>
                        <button onClick={handlePlatilloMenuCircular}>Platillos en el Menu</button>
                    </div>
                </section>
            </div>
            <h1>Seleccione Las Variables</h1>
            <div className='horizontal'>
                {/* Lista de platillos, utensilios, etc */}
                <TableWithCheckboxes ref={SelectedItemsRef} data={datosDependientes} />
                {/* Lista de tiempos */}
                <SelectTime ref={SelectedTimeRef} data={datosIndependientes} />
            </div>
            <div className="botones">
                <button onClick={handleNavigation}>Crear Informe</button>
            </div>
        </div>
    );
};

export default Informes;
