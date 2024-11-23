import { useState } from 'react';
import { createTipoUtensilio } from '@services/utensilio.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

//Esta funcion crea los metodos **hooks** para
//crear y los retorna
//El parametro de esta funcion es un hook que permite
//cambiar el estado de los tipoUtensilio dentro de React
const useTipoUtensilio = (setTipoUtensilio) => {
    //Funcion para el boton de crear
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false)
    //No se porque esta linea tiene un [] pero asi estaba en useEditUser
    const [dataTipoUtensilio, setDataTipoUtensilio] = useState([])
    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true)
    }
    //Funcion que crea el tipo utensilio en la base de datos
    const handleCreate = async (newDataTipoUtensilio) => {
        if (newDataTipoUtensilio) {
            try {
                const createdTipoUtensilio = await createTipoUtensilio(newDataTipoUtensilio);
                showSuccessAlert(`¡Actualizado!', 'El  
                    tipo utensilio ha sido actualizado correctamente.`);
                setIsCreatePopUpOpen(false);
                //const formattedUser = formatPostUpdate(createdTipoUtensilio);
                //añadir el nuevo usuario
                //Importante no olvidar el .data
                setTipoUtensilio(prevArray => [...prevArray, createdTipoUtensilio.data])
                setDataTipoUtensilio([]);
            }catch (error) {
                console.error('Error al crear el tipo utensilio:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al crear el tipo utensilio.');
            }
        }
    }

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataTipoUtensilio,
        setDataTipoUtensilio
    }
}

export default useTipoUtensilio;