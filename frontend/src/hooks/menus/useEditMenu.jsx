import {useState} from 'react';
import {showErrorAlert, showSuccessAlert} from '@helpers/sweetAlert.js';
import {updateMenu} from '@services/menu.service.js';

const useEditMenu = (setMenus, fetchMenus) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMenu, setDataMenu] = useState([]);

    const handleClickUpdate = () => {
        if (dataMenu.length > 0) {
            console.log('Seleccionado para actualizar:', dataMenu[0]);
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataMenu) => {
        try {
            const id = dataMenu[0]?.id_menu;
    
            if (!id) {
                throw new Error('ID no válido para el menú seleccionado.');
            }
    
            const updatedMenu = await updateMenu(updatedDataMenu, id);
    
            setMenus((prevMenus) =>
                prevMenus.map((menu) =>
                    menu.id_menu === id ? updatedMenu : menu
                )
            );
            await fetchMenus();
    
            showSuccessAlert('¡Actualizado!', 'El menú ha sido actualizado correctamente.');
            setIsPopupOpen(false);
            setDataMenu([]);
        } catch (error) {
            console.error('Error al actualizar el menú:', error.message);
            showErrorAlert('Error', error.message || 'Ocurrió un error al actualizar el menú.');
        }
    };
    
    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataMenu,
        setDataMenu,
    };
}
export default useEditMenu;