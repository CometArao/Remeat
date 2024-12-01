import { useState } from 'react';
import { updateProveedor } from '@services/proveedores.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditProveedor = (setProveedores, fetchProveedores) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataProveedor, setDataProveedor] = useState([]); // Proveedor seleccionado

    // Abre el popup de formulario
    const handleClickUpdate = () => {
        if (dataProveedor.length > 0) {
            setIsPopupOpen(true);
        }
    };

    // Realiza la actualización y asegura que el ID se pase correctamente
    const handleUpdate = async (updatedProveedorData) => {
        if (updatedProveedorData) {
            try {
                const allowedData = {
                    nombre_proveedor: updatedProveedorData.nombre_proveedor,
                    tipo_proveedor: updatedProveedorData.tipo_proveedor,
                    correo_proveedor: updatedProveedorData.correo_proveedor,
                };

                // Envía los datos al backend junto con el ID del proveedor
                await updateProveedor(allowedData, dataProveedor[0].id_proveedor);

                // Refresca la tabla
                await fetchProveedores();

                // Muestra mensaje de éxito
                showSuccessAlert('¡Proveedor Actualizado!', 'Los datos del proveedor se han actualizado correctamente.');

                // Cierra el popup y resetea el estado
                setIsPopupOpen(false);
                setDataProveedor([]);
            } catch (error) {
                console.error('Error al actualizar el proveedor:', error);
                showErrorAlert('Error', 'Ocurrió un problema al actualizar los datos del proveedor.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataProveedor,
        setDataProveedor,
    };
};

export default useEditProveedor;
