import { useState } from 'react';
import { createUnidadMedida } from '@services/unidad_medida.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

//Esta funcion crea los metodos **hooks** para
//crear y los retorna
//El parametro de esta funcion es un hook que permite
//cambiar el estado de los tipoUtensilio dentro de React
const useUnidadMedida = (setUnidadMedida) => {
    //Funcion para el boton de crear
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false)
    const [dataUnidadMedida, setDataUnidadMedida] = useState([])
    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true)
    }
    //Funcion que crea el tipo utensilio en la base de datos
    const handleCreate = async (newDataUnidadMedida) => {
        if (newDataUnidadMedida) {
            try {
                const createdUnidadMedida = await createUnidadMedida(newDataUnidadMedida);
                showSuccessAlert(`¡Actualizado!', 'El  
                    La unidad de medida ha sido actualizada correctamente.`);
                setIsCreatePopUpOpen(false);
                //const formattedUser = formatPostUpdate(createdTipoUtensilio);
                //añadir el nuevo usuario
                //Importante no olvidar el .data
                setUnidadMedida(prevArray => [...prevArray, createdUnidadMedida.data])
                setDataTipoUtensilio([]);
            }catch (error) {
                console.error('Error al crear la unidad de medida:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al crear la unidad de medida.');
            }
        }
    }
    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataUnidadMedida,
        setDataUnidadMedida
    }
}

export default useUnidadMedida;