import { useState } from "react";
import { activateMenu } from "@services/menu.service";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert";

const useActivateMenu = (fetchMenus) => {
    const [isActivating, setIsActivating] = useState(false);

    const handleActivateMenu = async (id_menu) => {
        try {
            setIsActivating(true);
            await activateMenu(id_menu);
            showSuccessAlert("¡Activado!", "El menú se ha activado correctamente.");
            await fetchMenus(); // Refrescar menús
        } catch (error) {
            console.error("Error al activar menú:", error);
            showErrorAlert("Error", error.message || "Ocurrió un error al activar el menú.");
        } finally {
            setIsActivating(false);
        }
    };

    return { handleActivateMenu, isActivating };
};

export default useActivateMenu;
