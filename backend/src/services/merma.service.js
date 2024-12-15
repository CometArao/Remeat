import Mermas from "../entity/merma.entity.js"
import UtensilioMermas from "../entity/utensilio_merma.entity.js"
import IngredientesMermas from "../entity/ingrediente_merma.entity.js"
import { AppDataSource } from "../config/configDb.js";
import { handleErrorServer } from "../handlers/responseHandlers.js";
import merma from "../entity/merma.entity.js";



export async function createMermaService(query) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        const utensilioMermaRepository = AppDataSource.getRepository(UtensilioMermas);
        const ingredienteMermaRepository = AppDataSource.getRepository(IngredientesMermas);
        console.log("Crear mermas")
        console.log(query)
        const { utensilios, ingredientes} = query;
        console.log(utensilios)
        console.log(ingredientes)

        const today = new Date()
        const formatedDate = today.toISOString()
        const nuevaMerma = mermasRepository.create({
            fecha_merma: formatedDate,
        })
        const mermaCreada = await mermasRepository.save(nuevaMerma);
        //crear los utensilios y ingredientes
        for(let i = 0; i < utensilios.length; i++) {
            const utensilio = utensilios[i]
            const nuevoUtensilioMerma = utensilioMermaRepository.create({
                id_utensilio: utensilio.id_utensilio,
                id_merma: mermaCreada.id_merma,
                cantidad_perdida_utensilio: utensilio.cantidad_perdida
            })
            const UtensilioMermaCreado = await utensilioMermaRepository.save(nuevoUtensilioMerma);
            console.log(UtensilioMermaCreado)
            if(!UtensilioMermaCreado) {
                return [null, "Error al crear utensilio Merma"]
            }
            //ajustar cantidad utensilio
            const utensilioAEditar = await AppDataSource.query(`
                SELECT *
                FROM utensilio u
                WHERE u.id_utensilio = $1
                `, [ingrediente.id_ingrediente])
            if(!utensilioAEditar) {
                return [null, "Error integridad de la base de datos"]
            }
            const nuevaCantidad = utensilioAEditar.cantidad_ingrediente - utensilio.cantidad_perdida; 
            await AppDataSource.query(`
            UPDATE utensilio
            SET cantidad_utensilio = $1
            WHERE id_utensilio = $2; 
            `, [nuevaCantidad, utensilio.id_utensilio])
        }
        for(let i = 0; i < ingredientes.length; i++) {
            console.log("Añadir ingrediente")
            const ingrediente = ingredientes[i]
            const nuevoIngredienteMerma = await AppDataSource.query(`
            INSERT INTO ingrediente_merma (id_ingrediente, id_merma, cantidad_perdida_ingrediente)    
            VALUES ($1, $2, $3)
            `, [ingrediente.id_ingrediente, mermaCreada.id_merma, ingrediente.cantidad_perdida])

            if(!nuevoIngredienteMerma) {
                return [null, "Error al crear ingrediente merma"]
            }
            //ajustar cantidad_ingrediente
            const ingredienteAEditar = await AppDataSource.query(`
                SELECT *
                FROM ingrediente i
                WHERE i.id_ingrediente = $1
                `, [ingrediente.id_ingrediente])
            const nuevaCantidad = ingredienteAEditar.cantidad_ingrediente - ingrediente.cantidad_perdida; 
            await AppDataSource.query(`
            UPDATE ingrediente 
            SET cantidad_ingrediente = $1
            WHERE id_ingrediente = $2; 
            
                `, [nuevaCantidad, ingrediente.id_ingrediente])
        }
        
        return [nuevaMerma, null];
    }catch(error) {
        console.error("Error al crear una merma", error)
        return [null, error.message]
    }
}

export async function getMermaService(id_merma) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        //verificar que es una id

        const mermaEncontrada = await mermasRepository.findOne({
            where: { id_merma: id_merma }
        })
        //seleccionar todos los ingredientes de la merma
        const ingredientes = await AppDataSource.query(`
            SELECT *
            FROM ingrediente i
            INNER JOIN ingrediente_merma im ON im.id_ingrediente = i.id_ingrediente 
            INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_tipo_ingrediente
            INNER JOIN compuesto_ingrediente ci ON ci.id_ingrediente = i.id_ingrediente
            INNER JOIN pedido p ON p.id_pedido = ci.id_pedido
            WHERE im.id_merma = $1
        `, [id_merma])
        if(!ingredientes) {
            return [null, "Error no se encontro ingrediente"]
        }
        console.log(ingredientes)
        mermaEncontrada.ingredientes = ingredientes;

        //seleccionar todos los utensilios de la merma
        const utensilios = await AppDataSource.query(`
        SELECT *
        FROM utensilio u    
        INNER JOIN utensilio_merma um ON um.id_utensilio = u.id_utensilio
        INNER JOIN tipo_utensilio tu ON tu.id_tipo_utensilio = u.id_tipo_utensilio
        INNER JOIN compuesto_utensilio cu ON cu.id_utensilio = u.id_utensilio
        INNER JOIN pedido p ON p.id_pedido = cu.id_pedido
        WHERE um.id_merma = $1
        `, [id_merma])
        console.log(utensilios)
        mermaEncontrada.utensilios = utensilios;

        if(!mermaEncontrada) {
            return [null, "Error no se encontro la merma"]
        }
        return [mermaEncontrada, null];
    }catch(error) {
        console.error("error al obtener la merma", error);
        return [null, "Error interno del servidor"]
    }
}

export async function getMermasService() {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

    const mermasEncontradas = await mermasRepository.find();
    if (!mermasEncontradas) {
        return [null, "mermas no encontrado"];
    } 
    return [mermasEncontradas, null];
    }catch(error) {
        console.error("Error al obtener las mermas", error);
        return [null, "Error interno del servidor"]
    }
}
export async function updateMermaService(body) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        const mermaEncontrada = await mermasRepository.findOne({
            where: { id_merma : body.id_merma }
        })
        if(!mermaEncontrada) {
            return [null, "No se encontro la merma a editar"]
        }
        const mermaEditada = {
            id_merma: body.id_merma,
            fecha: body.fecha,
            cantidad_perdida: body.cantidad_perdida
        }
        console.log(mermaEditada)
        await mermasRepository.update(
            { id_merma: body.id_merma },
            mermaEditada
        );
        return [mermaEditada, null]
    }catch(error) {
        console.log(error)
        return [null, "Error en el servidor"]
    }
}
export async function deleteMermaService(id) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        const mermaEncontrada = await mermasRepository.findOne({
            where: { id_merma: id }
        })
        if(!mermaEncontrada) {
            return [null, "No se encontro la merma especificada"]
        }
        await AppDataSource.query(`
            DELETE FROM utensilio_merma
            where id_merma = $1
            `, [id])
        await AppDataSource.query(`
            DELETE FROM ingrediente_merma 
            where id_merma = $1
            `, [id])
        const mermaEliminada = await mermasRepository.remove(mermaEncontrada);
        return [mermaEliminada, null];
    }catch(error) {
        console.log(error)
        return [null, "Error interno del servidor"]
    }
}