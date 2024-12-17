import { useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { updateMenu } from '@services/menu.service.js';
import { formatDateToISO } from '../../../../backend/src/utils/dateUtils.js'; // Importar formateo a ISO

const useEditMenu = (setMenus, fetchMenus) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMenu, setDataMenu] = useState([]);

    // Abre el popup con la tarjeta seleccionada y reformatea la fecha
    const handleClickUpdate = (selectedMenu) => {
        if (selectedMenu) {
            const formattedMenu = {
                ...selectedMenu,
                fecha: formatDateToISO(selectedMenu.fecha), // Reformatear fecha a YYYY-MM-DD
            };
            setDataMenu([formattedMenu]); // Almacena el menú formateado
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataMenu) => {
        try {
            const id = dataMenu[0]?.id_menu;

            if (!id) throw new Error('ID no válido para el menú seleccionado.');

            const updatedMenu = await updateMenu(updatedDataMenu, id);
            await fetchMenus();

            setMenus((prevMenus) =>
                prevMenus.map((menu) =>
                    menu.id_menu === id ? updatedMenu : menu
                )
            );

            showSuccessAlert('¡Actualizado!', 'El menú ha sido actualizado correctamente.');
            setIsPopupOpen(false);
            await fetchMenus();
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
};

export default useEditMenu;
