"use strict";
import { Router } from "express";
import { isAdmin,
    verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createProveedor,
         deleteProveedor,
         getAllProveedores,
         getProveedorById,
         updateProveedor
} from "../controllers/proveedor.controller.js";

// Se verifica sesión, autorización y horario laboral
const router = Router();

router.use(authenticateJwt)
    .use(isAdmin)
    .use(verificarHorarioLaboral);

// Rutas para manejar proveedores
router.post("/", createProveedor)
    .get("/", getAllProveedores)
    .get("/:id_proveedor", getProveedorById)
    .patch("/:id_proveedor", updateProveedor)
    .delete("/:id_proveedor", deleteProveedor);

export default router;