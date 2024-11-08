"use strict";
import { AppDataSource } from "../config/configDb.js";
import Pedido from "../entity/pedido.entity.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import Utensilio from "../entity/utensilio.entity.js";
//import CompuestoIngrediente from "../entity/compuesto_ingrediente.entity.js";
//import CompuestoUtensilio from "../entity/compuesto_utensilio.entity.js";
import Usuario from "../entity/usuario.entity.js";

export async function createPedidoService(data) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const compuestoIngredienteRepository = AppDataSource.getRepository(CompuestoIngrediente);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const compuestoUtensilioRepository = AppDataSource.getRepository(CompuestoUtensilio);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    try {
        const {
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido,
            fecha_entrega_pedido,
            costo_pedido,
            cantidad_ingrediente_pedido,
            cantidad_utensilio_pedido,
            ingredientes,
            utensilios,
            id_usuario
        } = data;

        // Verificar que el usuario exista y sea administrador
        const usuario = await usuarioRepository.findOneBy({ id_usuario });
        if (!usuario || usuario.rol_usuario !== "administrador") {
            return [null, "El usuario no existe o no tiene permisos para crear pedidos"];
        }

        // Crear el pedido
        const newPedido = pedidoRepository.create({
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido,
            fecha_entrega_pedido,
            costo_pedido,
            cantidad_ingrediente_pedido,
            cantidad_utensilio_pedido,
            usuario,
        });
        await pedidoRepository.save(newPedido);

        // Verificar existencia de ingredientes y crear compuesto_ingrediente
        if (ingredientes && ingredientes.length > 0) {
            const ingredientesToAdd = await Promise.all(
                ingredientes.map(async (ingrediente) => {
                    const ingredienteExistente =
                        await ingredienteRepository.findOneBy({ id_ingrediente: ingrediente.id_ingrediente });

                    if (!ingredienteExistente) {
                        throw new Error(`El ingrediente con id ${ingrediente.id_ingrediente} no existe.`);
                    }

                    return compuestoIngredienteRepository.create({
                        id_ingrediente: ingrediente.id_ingrediente,
                        id_pedido: newPedido.id_pedido,
                        costo_ingrediente: ingrediente.costo_ingrediente,
                        cantidad_ingrediente_pedido: ingrediente.cantidad_ingrediente_pedido,
                    });
                })
            );

            await compuestoIngredienteRepository.save(ingredientesToAdd);
        }

        // Verificar existencia de utensilios y crear compuesto_utensilio
        if (utensilios && utensilios.length > 0) {
            const utensiliosToAdd = await Promise.all(
                utensilios.map(async (utensilio) => {
                    const utensilioExistente =
                        await utensilioRepository.findOneBy({ id_utensilio: utensilio.id_utensilio });

                    if (!utensilioExistente) {
                        throw new Error(`El utensilio con id ${utensilio.id_utensilio} no existe.`);
                    }

                    return compuestoUtensilioRepository.create({
                        id_utensilio: utensilio.id_utensilio,
                        id_pedido: newPedido.id_pedido,
                        costo_utensilio: utensilio.costo_utensilio,
                        cantidad_utensilio_pedido: utensilio.cantidad_utensilio_pedido,
                    });
                })
            );

            await compuestoUtensilioRepository.save(utensiliosToAdd);
        }

        return [newPedido, null];
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return [null, error.message];
    }
}
