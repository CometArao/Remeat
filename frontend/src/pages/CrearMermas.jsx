import { useLocation } from 'react-router-dom'
import useGetTiposIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetIngredientes from '../hooks/ingredientes/useGetIngredientes';
import TablaChecklist from '../hooks/mermas/TablaChecklist'
import { useState, useRef, useEffect } from 'react';
import tipo_ingrediente from '../../../backend/src/entity/tipo_ingrediente.entity';




//Agregar boton volver a mermas

const CrearMermas = () => {
    const location = useLocation();
    const today = location.state;
    const { ingredientes, fetchIngredientes, setIngredientes } = useGetIngredientes();
    const { tiposIngrediente, fetchTiposIngrediente } = useGetTiposIngrediente();
    useEffect(() => {
        fetchIngredientes();
        fetchTiposIngrediente();
    }
    , []);

    const [selectedItems, setSelectedItems] =
        useState(["item"])
    const SelectedItemsRef = useRef();


    const columns_ingredientes = [
        { title: 'Fecha de Vencimiento', field: 'fecha_vencimiento', width: 200 },
        { title: 'Cantidad', field: 'cantidad_ingrediente', width: 150 },
        { title: 'Cantidad Original', field: 'cantidad_original_ingrediente', width: 200 },
        { title: 'Costo', field: 'costo_ingrediente', width: 150 },
        { title: 'Tipo de Ingrediente', field: 'nombre_tipo_ingrediente', width: 200 },
    ];
    const columns_utensilios = [
        { title: 'Cantidad', field: 'cantidad_utensilio', width: 150 },
        { title: 'Costo', field: 'costo_utensilio', width: 150 },
        { title: 'Tipo de Ingrediente', field: 'nombre_tipo_utensilio', width: 200 },
    ];
    const arg = { data: 
        {ingredientes: ingredientes, tipo_ingrediente: tiposIngrediente },
         columns: columns_ingredientes }
    console.log("arg")
    console.log(arg)
    return (
        <div className="main-container">
            <TablaChecklist ref={SelectedItemsRef} arg={arg} />
            <button>Crear Merma</button>
        </div>
    )
}

export default CrearMermas