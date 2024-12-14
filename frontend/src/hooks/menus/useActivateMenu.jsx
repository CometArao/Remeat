import { useState } from "react";
import { activateMenu } from "@services/menu.service";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert";

const useActivateMenu = (fetchMenus) => {
    const [isActivating, setIsActivating] = useState(false);
    const handleActivateMenu = async (id_menu, currentDisponibility) => {
        try {
            setIsActivating(true);
    
            await activateMenu(id_menu); // Llamada al servicio de activación/desactivación
    
            await fetchMenus(); // Refrescar la lista completa
    
            showSuccessAlert(
                currentDisponibility ? "¡Desactivado!" : "¡Activado!",
                `El menú ha sido ${currentDisponibility ? "desactivado" : "activado"} correctamente.`
            );
        } catch (error) {
            console.error("Error al alternar disponibilidad del menú:", error);
            showErrorAlert("Error", error.message || "Ocurrió un error.");
        } finally {
            setIsActivating(false);
        }
    };

    return { handleActivateMenu, isActivating };
};

export default useActivateMenu;
