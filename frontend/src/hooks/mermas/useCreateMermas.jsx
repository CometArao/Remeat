import { useState } from "react";
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { crearMerma } from "../../services/merma.service";

const useMerma = (setMerma) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);
    const [dataMerma, setDataMerma] = useState([])
    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true)
    }
    const handleCreate = async (newDataMerma) => {
        if (!newDataMerma) {
            return null;
        }
        try {
            const createdMerma = await crearMerma(newDataMerma);
            showSuccessAlert(`¡Actualizado!', 'La  
                    Merma ha sido actualizado correctamente.`);
            setIsCreatePopUpOpen(false);
            setMerma(prevArray => [...prevArray, createdMerma.data])
            setDataMerma([])
        } catch (error) {
            console.error("Error al crear la merma", error);
            showErrorAlert("Cancelado, Ocurrio un error al crear la merma");
        }
    }
    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataMerma,
        setDataMerma
    }
}
export default useMerma;