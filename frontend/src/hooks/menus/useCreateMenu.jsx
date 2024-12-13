import { useState } from "react";
import { createMenu } from "@services/menu.service";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";

const useCreateMenu = (fetchMenu) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataMenu, setDataMenu] = useState([]);
    
    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };
    
    const handleCreate = async (newDataMenu) => {
        if (newDataMenu) {
          try {
            const createdMenu = await createMenu(newDataMenu);
            showSuccessAlert("¡Creado!", "El menú ha sido creado correctamente.");
            setIsCreatePopupOpen(false);
      
            await fetchMenu();
      
            setDataMenu([]);
          } catch (error) {
            console.error("Error al crear el menú:", error);
      
            // Captura el mensaje de error del backend
            const mensajeError =
              error?.message ||
              error?.details?.message || // Intenta extraer el mensaje desde "details"
              "Ocurrió un error inesperado."; // Mensaje genérico en caso de falla
      
            showErrorAlert("Error", mensajeError); // Muestra el mensaje en el popup
          }
        }
      };
      
    
    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataMenu,
        setDataMenu,
    };
    };

export default useCreateMenu;