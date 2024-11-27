"use strict";
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";

// Crear un nuevo proveedor
export async function createProveedorService(data) {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    try {
        const newProveedor = proveedorRepository.create(data); // Crea una nueva instancia del proveedor
        await proveedorRepository.save(newProveedor); // Guarda el nuevo proveedor en la base de datos

        return [newProveedor, null];
    } catch (error) {
        console.error("Error al crear el proveedor:", error);
        return [null, error.message];
    }
}

// Obtener todos los proveedores
export async function getAllProveedoresService() {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    try {
        const proveedores = await proveedorRepository.find();
        return [proveedores, null];
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        return [null, error.message];
    }
}

// Obtener un proveedor específico por ID
export async function getProveedorByIdService(id_proveedor) {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    try {
        const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
        if (!proveedor) {
            return [null,"Proveedor no encontrado"];
        }

        return [proveedor,null];
    } catch (error) {
         console.error("Error al obtener el proveedor:", error);
         return [null,error.message];
     }
}

// Actualizar un proveedor
export async function updateProveedorService(id_proveedor,data) {
     const proveedorRepository = AppDataSource.getRepository(Proveedor);

     try {
         const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
         if (!proveedor) {
             return [null,"Proveedor no encontrado"];
         }

         // Actualizar solo los campos permitidos
         Object.assign(proveedor,data); // Asigna los nuevos valores a los campos existentes

         await proveedorRepository.save(proveedor); // Guarda los cambios

         return [proveedor,null];
     } catch (error) {
         console.error("Error al actualizar el proveedor:", error);
         return [null,error.message];
     }
}

// Eliminar un proveedor
export async function deleteProveedorService(id_proveedor) {
     const proveedorRepository = AppDataSource.getRepository(Proveedor);

     try {
         const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
         if (!proveedor) {
             return [null,"Proveedor no encontrado"];
         }

         await proveedorRepository.delete(id_proveedor); // Elimina el proveedor

         return [true,null]; // Retornar true si se eliminó exitosamente
     } catch (error) {
         console.error("Error al eliminar el proveedor:", error);
         return [null,error.message];
     }
}