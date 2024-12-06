import { Router } from "express";
import { createMedidaController,
        deleteMedidaController,
        getMedidaByIdController,
        getMedidasController,
        updateMedidaController       
 } from "../controllers/unidad_medida.controller.js";
 import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
// Rutas para unidad de medida
router.use(authenticateJwt).use(authorizeRoles(["administrador", "cocinero"]));
router
  .post("/", createMedidaController)       // Crear una nueva unidad de medida
  .get("/", getMedidasController)          // Obtener todas las unidades de medida
  .get("/:id", getMedidaByIdController)   // Obtener una unidad de medida por ID
  .patch("/:id", updateMedidaController)    // Actualizar una unidad de medida por ID
  .delete("/:id", deleteMedidaController); // Eliminar una unidad de medida por ID

export default router;