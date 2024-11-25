import { useState, useRef } from 'react';
import { getPlatillos } from '../services/platillos.service';
import TableWithCheckboxes from '@components/TableWithCheckboxes';
import SelectTime from '@components/SelectTime'
import '@styles/informes.css';
import { showErrorAlert } from '@helpers/sweetAlert.js';
import { useNavigate } from 'react-router-dom';
import { getVentasPlatillo } from '@services/informes.service.js'


const tiempo_lineal = [
    {
        id: 1,
        name: "fecha"
    },
    {
        id: 2,
        name: "Hora"
    },
    {
        id: 3,
        name: "Mes"
    },
    {
        id: 4,
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

    //Este metodo se ejecuta al presionar el boton de ventas platillo
    //Este metodo llama a la backend por la informacion de ventas platillo
    const handleClickVentasPlatillo = async () => {
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
            setTipoGrafico({tipoGrafico: "lineal", variable: "ventas_platillo"})
            setDatosIndependientes(tiempo_lineal)
        } catch (error) {
            console.log(error)
            console.error('Error al buscar los platos:', error);
            showErrorAlert('Error, No se pudieron encontrar los platos');
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
        if(!selectedItems || selectedItems[0].id == -1) {
            showErrorAlert('Error, Debe seleccionar en la checklist de items')
            return;
        }
        if(!selectedTime || selectedTime.id == -1) {
            showErrorAlert('Error, Debe seleccionar en la checklist de tiempo')
            return;
        }
        let ids = []
        for(let i = 0; i < selectedItems.length; i++) {
            ids.push(selectedItems[i].id)
        }
        const ventas_platillo = 
            await getVentasPlatillo(ids);
        const datos = {
            indendientes: selectedTime,
            dependientes: ventas_platillo,
            tipo: tipoGrafico
        }
        navigate('/grafico', {state: datos});
    }

    return (
        <div className="main-container">
            <h1>Seleccione El Grafico</h1>
            <div> {/* Lista de graficos */}
                <h2>Linea</h2>
                <button>Ventas</button>
                <button>Costo</button>
                <button>Utilidades</button>
                <button>Stock Utensilios</button>
                <button>Stock Ingredientes</button>
                {/*Recordatorio el metodo no debe tener parentesis al final  */}
                <button onClick={handleClickVentasPlatillo}>Ventas Platillos</button>
                <h2>Barra</h2>
                <button onClick={handleClickVentasPlatillo}>Ventas Platillos</button>
                <button>Platillos en el Menu</button>
                <h2>Circular</h2>
                <button onClick={handleClickVentasPlatillo}>Ventas Platillos</button>
                <button>Platillos en el Menu</button>
            </div>
            <h1>Seleccione Las Variables</h1>
            <div className='horizontal'>
                {/* Lista de platillos, utensilios, etc */}
                <TableWithCheckboxes ref={SelectedItemsRef} data={datosDependientes} />
                {/* Lista de tiempos */}
                <SelectTime ref={SelectedTimeRef} data={datosIndependientes} />
            </div>
            <button onClick={handleNavigation}>Crear Informe</button>
            {/* redireccion ¿? */}
        </div>
    );
};

export default Informes;
