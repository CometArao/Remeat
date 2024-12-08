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
        const { utensilios, ingredientes} = query;

        const today = new Date()
        const formatedDate = today.toISOString()
        console.log("formatedDate")
        console.log(formatedDate)
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
            if(!UtensilioMermaCreado) {
                return [null, "Error al crear utensilio Merma"]
            }
        }
        for(let i = 0; i < ingredientes.length; i++) {
            const ingredientes = ingredientes[i]
            const nuevoIngredienteMerma = ingredienteMermaRepository.create({
                id_utensilio: ingredientes.id_utensilio,
                id_merma: mermaCreada.id_merma,
                cantidad_perdida_utensilio: ingredientes.cantidad_perdida
            })
            const ingredienteMermaCreado = await ingredienteMermaRepository.save(nuevoIngredienteMerma);
            if(!ingredienteMermaCreado) {
                return [null, "Error al crear ingrediente merma"]
            }
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