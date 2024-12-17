import { useState, useRef } from 'react';
import { getPlatillos } from '../services/platillos.service';
import { getTiposIngrediente } from '@services/ingredientes.service.js'
import TableWithCheckboxes from '@components/TableWithCheckboxes';
import SelectTime from '@components/SelectTime'
import '@styles/informe.css';
import { showErrorAlert } from '@helpers/sweetAlert.js';
import { useNavigate } from 'react-router-dom';
import {
    getVentasPlatillo, getCostosNormal,
    getStockUtensilio, getStockIngrediente,
    getPlatilloMenu,
    getVentas, getUtilidades,
    getCostosPlatillo
} from '@services/informes.service.js'
import { getIngredientes } from '../services/ingredientes.service';
import { getTiposUtensilio } from '../services/utensilio.service';
import {
    construirLinealPlatillosIngresos, construirLinealPlatillosVentas,
    construirLinealStockUtensilios, construirStockIngredientes,
    construirVentasPlatilloBarra, construirPlatillosMenuBarra,
    construirVentasPlatilloCircular, construirPlatillosMenuCircular,
    construirLinealCosto, idsCosto, construirLinealUtilidades,
    ajustarEntradasDistintas, ordenarHorasObjetos
} from '../services/construirGrafico.service'
import Search from '../components/Search';


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
        id: 0,
        name: "Dia"
    },
    {
        id: 1,
        name: "Mes"
    },
    {
        id: 2,
        name: "Año"
    },
    {
        id: 3,
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
    const [filterName, setFilterName] = useState('');

    const handleNameFilterChange = (e) => {
        console.log(e)
        setFilterName(e.target.value.toLowerCase());
    };

    const handleSelectedItems = () => {
        const selected = SelectedItemsRef.current.getSelectedItems()
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
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "ingresos_ventas_platillo",
                titulo: "Ventas Platillos"
            })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            console.error('Error al buscar los platos:', error);
            showErrorAlert('Error, No se pudieron encontrar los platos');
        }
    }
    //const handleClickCosto = async () => {
    //try {
    //const ingredientes = await getTiposIngrediente();
    //const utensilios = await getTiposUtensilio();
    //let formatedList = [];
    //for (let i = 0; i < ingredientes.length; i++) {
    //const ingrediente = ingredientes[i];
    //const IngredienteFormatedData = {
    //id: "ingrediente_" + ingrediente.id_tipo_ingrediente,
    //name: ingrediente.nombre_tipo_ingrediente,
    //}
    //formatedList.push(IngredienteFormatedData)
    //}
    //for (let i = 0; i < utensilios.length; i++) {
    //const utensilio = utensilios[i];
    //const utensilioFormatedData = {
    //id: "utensilio_" + utensilio.id_tipo_utensilio,
    //name: utensilio.nombre_tipo_utensilio,
    //}
    //formatedList.push(utensilioFormatedData)
    //}
    //setDatosDependientes(formatedList)
    //setTipoGrafico({ tipoGrafico: "lineal", variable: "costos" })
    //setDatosIndependientes(tiempo_lineal)
    //} catch (error) {
    //console.log(error)
    //showErrorAlert("Error no se pudo encontrar los ingredientes y utensilios")
    //}
    //}
    const handleClickCosto = async () => {
        try {
            const platillos = await getPlatillos();
            let formatedList = [];
            for (let i = 0; i < platillos.length; i++) {
                const platillo = platillos[i];
                const platilloFormatedData = {
                    id: platillo.id_platillo,
                    name: platillo.nombre_platillo,
                }
                formatedList.push(platilloFormatedData)
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "costos",
                titulo: "Costos"
            })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert('Error, No se pudieron encontrar los platos');
            //showErrorAlert("Error no se pudo encontrar los ingredientes y utensilios")
        }
    }
    const handleClickUtilidades = async () => {
        try {
            const platillos = await getPlatillos()
            //const ingredientes = await getTiposIngrediente();
            //const utensilios = await getTiposUtensilio();
            let formatedList = [];
            for (let i = 0; i < platillos.length; i++) {
                const platillo = platillos[i];
                const platilloFormatedData = {
                    id: platillo.id_platillo,
                    name: platillo.nombre_platillo,
                }
                formatedList.push(platilloFormatedData)
            }
            //for (let i = 0; i < utensilios.length; i++) {
            //const utensilio = utensilios[i];
            //const utensilioFormatedData = {
            //id:  utensilio.id_tipo_utensilio,
            //name: utensilio.nombre_tipo_utensilio,
            //}
            //formatedList.push(utensilioFormatedData)

            //}
            setDatosDependientes(formatedList)
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "utilidades",
                titulo: "Utilidades"
            })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert('Error, No se pudieron encontrar los platos');
            //showErrorAlert("Error no se pudo encontrarse los ingredientes y utensilios")
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
            setDatosDependientes(formatedList)
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "stock_utensilios",
                titulo: "Stock Utensilios"
            })
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            showErrorAlert("Error no se pudo encontrar los utensilios")
        }
    }
    const handleStockIngredientes = async () => {
        try {
            const ingredientes = await getTiposIngrediente();
            console.log("Ingredientes")
            console.log(ingredientes)
            let formatedList = [];
            for (let i = 0; i < ingredientes.length; i++) {
                const ingrediente = ingredientes[i];
                const formatedIngrediente = {
                    id: ingrediente.id_tipo_ingrediente,
                    name: ingrediente.nombre_tipo_ingrediente
                }
                formatedList.push(formatedIngrediente)
            }
            if (formatedList.length === 0) {
                throw "No se encontraron elementos"
            }
            setDatosDependientes(formatedList)
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "stock_ingredientes",
                titulo: "Stock Ingredientes"
            })
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
            let formatedPlatillos = [];
            for (let i = 0; i < ventasPlatillos.length; i++) {
                const ventaPlatillo = ventasPlatillos[i];
                const formatedPlatillo = {
                    id: ventaPlatillo.id_platillo,
                    name: ventaPlatillo.nombre_platillo
                }
                formatedPlatillos.push(formatedPlatillo);
            }
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({
                tipoGrafico: "lineal", variable: "ventas_platillo",
                titulo: "Cantidad de Ventas por Platillos"
            })
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
            setDatosDependientes(formatedPlatillos);
            setTipoGrafico({
                tipoGrafico: "barra", variable: "ventas_platillos_barra",
                titulo: "Cantidad Ventas Platillo"
            })
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
            setTipoGrafico({
                tipoGrafico: "barra", variable: "menu_platillos_barra",
                titulo: "Cantidad Platillo en el Menú del dia"
            })
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
            const ventasplatillos = await getPlatillos();
            let formatedplatillos = [];
            for (let i = 0; i < ventasplatillos.length; i++) {
                const ventaplatillo = ventasplatillos[i];
                const formatedplatillo = {
                    id: ventaplatillo.id_platillo,
                    name: ventaplatillo.nombre_platillo
                }
                formatedplatillos.push(formatedplatillo);
            }
            console.log(formatedplatillos)
            setDatosDependientes(formatedplatillos);
            setTipoGrafico({
                tipoGrafico: "circular", variable: "ventas_platillos_circular",
                titulo: "Cantidad Ventas Platillo"
            })
            setDatosIndependientes(tiempo_circular)
        } catch (error) {
            console.log(error);
            console.error('error al buscar los platos:', error)
            showErrorAlert("Error, no se pudieron encontrar los platos")
        }
    }
    const handlePlatilloMenuCircular = async () => {
        try {
            const platillos = await getPlatillos();
            let formatedlist = [];
            for (let i = 0; i < platillos.length; i++) {
                const platillo = platillos[i];
                const formateddata = {
                    id: platillo.id_platillo,
                    name: platillo.nombre_platillo
                }
                formatedlist.push(formateddata)
            }
            setDatosDependientes(formatedlist)
            setTipoGrafico({
                tipoGrafico: "circular", variable: "menu_platillos_circular",
                titulo: "Cantidad Platillo en el Menú del dia"
            })
            setDatosIndependientes(tiempo_circular)
        } catch (error) {
            console.log(error)
            console.error("error al buscar los platos", error)
            showErrorAlert("Error, no se pudieron encontrar los platos")
        }
    }
    const handleNavigation = async () => {
        if (!tipoGrafico) {
            showErrorAlert('Error, debe seleccionar un tipo de grafico');
            return;
        }
        const selectedItems = handleSelectedItems();
        const selectedTime = handleSelectedTime();
        console.log("selectedTime")
        console.log(selectedTime)
        //comprobar elementos seleccionados
        if (!selectedItems || selectedItems.length === 0 || selectedItems[0].id == -1) {
            showErrorAlert('Error, debe seleccionar en la checklist de items')
            return;
        }
        if ((!selectedTime || selectedTime.id == -1) && tipoGrafico.tipoGrafico != "barra") {
            showErrorAlert('Error, debe seleccionar en la checklist de tiempo')
            return;
        }
        let ids = []
        for (let i = 0; i < selectedItems.length; i++) {
            ids.push(selectedItems[i].id)
        }
        //llamar dependiendo del tipo de grafico todo:
        let datos = null;
        let formatedDependiente = null;
        let datos_barra = null
        let keys = null;
        let nuevasIds;
        console.log("tipo grafico variable")
        console.log(tipoGrafico.variable)
        switch (tipoGrafico.variable) {
            /*
            ###############################################
                Graficos Lineales
            ###############################################
            */
            case "ventas_platillo":
                console.log("ventas_platillo")
                const ventas_platillo =
                    await getVentasPlatillo(ids);
                const formateddata =
                    construirLinealPlatillosVentas(ventas_platillo, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formateddata,
                    tipo: tipoGrafico
                }
                break;
            case "ingresos_ventas_platillo":
                console.log("ingresos_ventas_platillo")
                const ingresos_ventas_platillo =
                    await getVentasPlatillo(ids);
                formatedDependiente =
                    construirLinealPlatillosIngresos(ingresos_ventas_platillo, selectedTime.name);
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico,
                }
                break;
            case "costos":
                //ajustar ids de costos debido a que estan editadas para que no se duplique la id
                //nuevasIds = idsCosto(ids)
                const costos = await getCostosPlatillo(ids) //ids separadas
                console.log("costos")
                console.log(costos)
                formatedDependiente =
                    construirLinealCosto(costos, selectedTime.name)
                console.log("formatedDependiente")
                console.log(formatedDependiente)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico
                }
                break;
            case "utilidades":
                console.log("utilidades")
                const utilidades = await getCostosPlatillo(ids)
                formatedDependiente =
                    construirLinealUtilidades(utilidades, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico
                }
                break;
            case "stock_utensilios":
                console.log("stock_utensilios")
                const stock_utensilio = await getStockUtensilio(ids)
                formatedDependiente =
                    construirLinealStockUtensilios(stock_utensilio, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico
                }
                break;
            case "stock_ingredientes":
                console.log("stock_ingredientes")
                const stock_ingredientes = await getStockIngrediente(ids)
                formatedDependiente =
                    construirStockIngredientes(stock_ingredientes, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico
                }
                break;
            /*
            ###############################################
                graficos en barra
            ###############################################
            */
            case "ventas_platillos_barra":
                console.log("ventas_platillos_barra")
                const ventas_platillo_barra =
                    await getVentasPlatillo(ids);
                [datos_barra, keys] =
                    construirVentasPlatilloBarra(ventas_platillo_barra)
                formatedDependiente = datos_barra
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico,
                    keys: keys
                }
                break;
            case "menu_platillos_barra":
                console.log("menu_platillos_barra")
                const menu_platillos_barra =
                    await getPlatilloMenu(ids);
                [datos_barra, keys] =
                    construirPlatillosMenuBarra(menu_platillos_barra)
                console.log("datos_barra")
                console.log(datos_barra)
                formatedDependiente = datos_barra;
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico,
                    keys: keys
                }
                break;
            /*
            ###############################################
                graficos circulares
            ###############################################
            */
            case "ventas_platillos_circular":
                console.log("ventas_platillos_circular")
                const ventas_platillos_circular =
                    await getVentasPlatillo(ids);
                [formatedDependiente, keys] =
                    construirVentasPlatilloCircular(ventas_platillos_circular, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico,
                    keys: keys
                }
                break;
            case "menu_platillos_circular":
                console.log("menu_platillos_circular")
                const menu_platillos_circular =
                    await getPlatilloMenu(ids);
                formatedDependiente =
                    construirPlatillosMenuCircular(menu_platillos_circular, selectedTime.name)
                datos = {
                    independientes: selectedTime,
                    dependientes: formatedDependiente,
                    tipo: tipoGrafico
                }
                break;
            default:
                showErrorAlert('default error ¿?')
                return
        }
        console.log("fin de switch")
        console.log(datos)
        if (datos.tipo.variable === "lineal") {
            ajustarEntradasDistintas(datos.dependientes)
            console.log("result")
            console.log(datos.dependientes)
            for (let i = 0; i < datos.dependientes.length; i++) {
                datos.dependientes[i].data = ordenarHorasObjetos(datos.dependientes[i].data);
            }
        }
        const dependientes_keys = Object.keys(datos.dependientes)
        if (datos.length == 0 || dependientes_keys.length == 0 || !datos.dependientes) {
            showErrorAlert('Error, parece que los elementos seleccionados no tienen suficiente informacion')
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
                    <h2>Lineal</h2>
                    <div className="botones">
                        <button onClick={handleClickVentas}>Ingresos Por Ventas Platillos</button>
                        <button onClick={handleClickCosto}>Costo</button>
                        <button onClick={handleClickUtilidades}>Utilidades</button>
                        <button onClick={handleStockUtensilios}>Stock Utensilios</button>
                        <button onClick={handleStockIngredientes}>Stock Ingredientes</button>
                        <button onClick={handleClickVentasPlatilloLineal}>Cantidad Ventas Platillos</button>
                    </div>
                </section>

                {/* Sección de gráficos de barra */}
                <section className="grafico-section">
                    <h2>Barras</h2>
                    <div className="botones">
                        <button onClick={handleClickVentasPlatilloBarra}>Cantidad Ventas Platillos</button>
                        <button onClick={handlePlatilloMenuBarra}>Platillos en el Menu</button>
                    </div>
                </section>

                {/* Sección de gráficos circulares */}
                <section className="grafico-section">
                    <h2>Circular</h2>
                    <div className="botones">
                        <button onClick={handleClickVentasPlatilloCircular}>Cantidad Ventas Platillos</button>
                        <button onClick={handlePlatilloMenuCircular}>Platillos en el Menu</button>
                    </div>
                </section>
            </div>
            <h1>Seleccione Las Variables</h1>
            <Search
                value={filterName}
                onChange={handleNameFilterChange}
                placeholder={'Filtrar por nombre'}
            />
            <div className='horizontal'>
                {/* Lista de platillos, utensilios, etc */}
                <TableWithCheckboxes ref={SelectedItemsRef} data={datosDependientes}
                    filtro={filterName} />
                {/* Lista de tiempos */}
                <SelectTime ref={SelectedTimeRef} data={datosIndependientes}
                />
            </div>
            <div className="botones">
                <button onClick={handleNavigation}>Crear Informe</button>
            </div>
        </div>
    );
};
export default Informes;
