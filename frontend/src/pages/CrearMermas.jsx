import SelectTime from '@components/SelectTime'
import { useCallback, useState, useRef } from 'react';
import useGetUtensilios from '../hooks/utensilios/useGetUtensilio';
import useGetIngredientesSinTiposNulos from '../hooks/ingredientes/useGetIngredientesSinTipoNulos';
import Search from '../components/Search';
import TablaUtensilios from '@hooks/mermas/TablaUtensilios.jsx';
import TablaIngredientes from '@hooks/mermas/TablaIngredientes.jsx';
import { crearMerma } from '../services/merma.service';
import { useNavigate } from 'react-router-dom';



const crearMermas = () => {
    const navigate = useNavigate();
    const [selectedIngredientes, setSelectedIngredientes] = useState([])
    const { utensilios, fetchUtensilios, setUtensilios } = useGetUtensilios();
    const [utensiliosSeleccionados, setSelectedUtensilios] = useState([])
    const { ingredientes, fetchIngredientes, setIngredientes } = useGetIngredientesSinTiposNulos();
    const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([])
    const [filterName, setFilterName] = useState('');

    //Crea una referencia para pasarsela a los componentes y compartir datos con los hijos
    const SelectedUtensiliosRef = useRef()
    const SelectedIngredientesRef = useRef();

    const handleSelectionChange = useCallback((selectedItems) => {
        setSelectedUtensilios(selectedItems);
    }, [setSelectedUtensilios]);

    const handleNameFilterChange = (e) => {
        console.log(e)
        setFilterName(e.target.value.toLowerCase());
    };

    //Extrae los datos de los ingredientes seleccionados del componente hijo
    const handleSelectedIngredientes = () => {
        const selected = SelectedIngredientesRef.current.getSelectedItems()
        setSelectedIngredientes(selected);
        return selected
    }
    const handleSelectedUtensilios = () => {
        const selected = SelectedUtensiliosRef.current.getSelectedItems()
        setSelectedUtensilios(selected)
        return selected
    }

    const handleNavigation = async () => {
        const selectedIngredientes = handleSelectedIngredientes();
        const selectedUtensilios = handleSelectedUtensilios();
        console.log("selectedIngredientes")
        console.log(selectedIngredientes)
        console.log("selectedUtensilios")
        console.log(selectedUtensilios)
        if ((!selectedIngredientes || selectedIngredientes.length === 0)
            &&
            (!selectedUtensilios || selectedUtensilios.length === 0)
        ) {
            console.log("Error") //TODO: Revisar error
            console.log(selectedIngredientes)
            return;
        }
        //Extraer los datos que nos importan de los utensilios
        let utensiliosEnviar = []
        for (let i = 0; i < selectedUtensilios.length; i++) {
            const utensilio = selectedUtensilios[i];
            const formatedUtensilio = {
                id_utensilio: utensilio.id_utensilio,
                cantidad_perdida: utensilio.cantidad_perdida
            }
            utensiliosEnviar.push(formatedUtensilio)
        }
        //Extraer los datos que nos importan de los ingredientes
        let ingredientesEnviar = []
        for (let i = 0; i < selectedIngredientes.length; i++) {
            const ingrediente = selectedIngredientes[i];
            const formatedIngrediente = {
                id_ingrediente: ingrediente.id_ingrediente,
                cantidad_perdida: ingrediente.cantidad_perdida
            }
            ingredientesEnviar.push(formatedIngrediente)
        }
        const datosAEnviar = {
            utensilios: utensiliosEnviar,
            ingredientes: ingredientesEnviar
        }
        //llamar servicio para crear 

        const merma = await crearMerma(datosAEnviar);


        //Redireccionar a /mermas
        navigate('/mermas');
    }

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registrar Mermas</h1>
                    <div className='filter-actions'>
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder={'Filtrar por nombre'}
                        />
                    </div>
                </div>
                <div className='horizontal'>
                    <TablaUtensilios ref={SelectedUtensiliosRef}
                        data={utensilios} filtro={filterName} />
                    {/* Lista de platillos, utensilios, etc */}
                    <TablaIngredientes ref={SelectedIngredientesRef}
                        data={ingredientes} filtro={filterName} />
                    {/* Lista de tiempos */}
                </div>
                <button onClick={handleNavigation}>Enviar</button>
            </div>
        </div>
    );
}
/**
 * 
 * 
 */
export default crearMermas;