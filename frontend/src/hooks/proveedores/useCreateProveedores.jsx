import { useState } from 'react';
import { createProveedor } from '@services/proveedores.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateProveedor = (setProveedores) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);
    const [dataProveedorCreate, setDataProveedorCreate] = useState({});

    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true);
    };

    const handleCreate = async (newProveedorData) => {
        if (newProveedorData) {
            try {
                const createdProveedor = await createProveedor(newProveedorData);
                showSuccessAlert('¡Proveedor Creado!', 'El proveedor se ha registrado correctamente.');
                setProveedores((prev) => [...prev, createdProveedor.data]);
                setIsCreatePopUpOpen(false);
            } catch (error) {
                console.error('Error al crear el proveedor:', error);
                showErrorAlert('Error', 'Ocurrió un problema al crear el proveedor.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataProveedorCreate,
        setDataProveedorCreate,
    };
};

export default useCreateProveedor;
