"use strict";
import { createPedidoService } from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createPedido(req, res) {
    try {
        const [newPedido, error] = await createPedidoService(req.body);
        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Pedido creado exitosamente", newPedido);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
