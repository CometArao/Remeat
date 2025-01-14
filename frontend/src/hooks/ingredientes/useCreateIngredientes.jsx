import { useState } from 'react';
import { createIngrediente } from '@services/ingredientes.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateIngrediente = (setIngredientes, fetchIngredientes) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataIngrediente, setDataIngrediente] = useState([]);

    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    const handleCreate = async (newDataIngrediente) => {
        if (newDataIngrediente) {
            try {/*
                // Elimina campos vacíos o nulos antes de enviar
                const cleanedData = Object.fromEntries(
                    Object.entries(newDataIngrediente).filter(([_, v]) => v != null && v !== '')
                );*/

                // Las cantidades originales y cantidad son las mismas
                newDataIngrediente.cantidad_original_ingrediente = newDataIngrediente.cantidad_ingrediente;
                console.log(newDataIngrediente)
    
                const createdIngrediente = await createIngrediente(newDataIngrediente);
                showSuccessAlert('¡Creado!', 'El ingrediente ha sido creado correctamente.');
                setIsCreatePopupOpen(false);
                setIngredientes((prevArray) => [...prevArray, createdIngrediente]);

                await fetchIngredientes();
                setDataIngrediente([]);
            } catch (error) {
                console.error('Error al crear el ingrediente:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear el ingrediente.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataIngrediente,
        setDataIngrediente,
    };
};

export default useCreateIngrediente;
