"use strict";
import { createProveedorService, 
    deleteProveedorService,
    getAllProveedoresService, 
    getProveedorByIdService, 
    updateProveedorService } from "../services/proveedor.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { proveedorBodyValidation } from "../validations/proveedor.validation.js"; // Importa las validaciones

export async function createProveedor(req, res) {
    try {
        // Validar el cuerpo del proveedor
        const { error } = proveedorBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [newProveedor, serviceError] = await createProveedorService(req.body);
        
        if (serviceError) {
            return handleErrorClient(res, 400, serviceError);
        }

        const responseData = {
            id_proveedor: newProveedor.id_proveedor,
            tipo_proveedor: newProveedor.tipo_proveedor,
            nombre_proveedor: newProveedor.nombre_proveedor,
            correo_proveedor: newProveedor.correo_proveedor,
        };

        handleSuccess(res, 201, "Proveedor creado exitosamente", responseData);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAllProveedores(req, res) {
    try {
        const [proveedores, error] = await getAllProveedoresService();
        
        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Proveedores obtenidos exitosamente", proveedores);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getProveedorById(req, res) {
    const { id_proveedor } = req.params;

    try {
        const [proveedor, error] = await getProveedorByIdService(id_proveedor);
        
        if (error) {
            if (error === "Proveedor no encontrado") {
                return handleErrorClient(res, 404, error);
            }
            return handleErrorServer(res, 500, error);
        }

        handleSuccess(res, 200, "Proveedor obtenido exitosamente", proveedor);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateProveedor(req, res) {
    const { id_proveedor } = req.params;

    try {
        // Validar el cuerpo del proveedor
        const { error } = proveedorBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedProveedor, errorService] = await updateProveedorService(id_proveedor, req.body);
        
        if (errorService) {
            if (errorService === "Proveedor no encontrado") {
                return handleErrorClient(res, 404, errorService);
            }
            return handleErrorServer(res, 500, errorService);
        }

        const responseData = {
            id_proveedor: updatedProveedor.id_proveedor,
            tipo_proveedor: updatedProveedor.tipo_proveedor,
            nombre_proveedor: updatedProveedor.nombre_proveedor,
            correo_proveedor: updatedProveedor.correo_proveedor,
        };

        handleSuccess(res, 200,"Proveedor actualizado exitosamente", responseData);
    } catch (error) {
       handleErrorServer(res ,500 ,error.message );
   }
}

export async function deleteProveedor(req, res) {
   const { id_proveedor } = req.params;

   try {
       const [result, error] = await deleteProveedorService(id_proveedor);
       
       if (error) {
           if (error === "Proveedor no encontrado") {
               return handleErrorClient(res ,404 ,error);
           }
           return handleErrorServer(res ,500 ,error);
       }

       handleSuccess(res ,200 ,"Proveedor eliminado exitosamente", null);
   } catch (error) {
       handleErrorServer(res ,500 ,error.message );
   }
}