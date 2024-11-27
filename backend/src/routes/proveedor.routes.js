"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createProveedor,
         deleteProveedor,
         getAllProveedores,
         getProveedorById,
         updateProveedor
} from "../controllers/proveedor.controller.js";

const router = Router();

// Middleware para autenticar y verificar rol
router.use(authenticateJwt).use(isAdmin); // Autenticar con JWT y verificar rol de administrador

// Rutas para manejar proveedores
router.post("/", createProveedor); // Ruta para crear un nuevo proveedor
router.get("/", getAllProveedores); // Ruta para obtener todos los proveedores
router.get("/:id_proveedor", getProveedorById); // Ruta para obtener un proveedor específico por ID
router.patch("/:id_proveedor", updateProveedor); // Ruta para actualizar un proveedor específico por ID
router.delete("/:id_proveedor", deleteProveedor); // Ruta para eliminar un proveedor específico por ID

export default router;