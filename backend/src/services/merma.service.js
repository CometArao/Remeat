import Mermas from "../entity/merma.entity.js"
import { AppDataSource } from "../config/configDb.js";
import { handleErrorServer } from "../handlers/responseHandlers.js";
import merma from "../entity/merma.entity.js";



export async function createMermaService(query) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        const { fecha, cantidad_perdida } = query;

        //declara una funcion con dos parametros que devuelve un diccionario(hashset) con esos dos parametros
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });
        const nuevaMerma = mermasRepository.create({
            fecha: fecha,
            cantidad_perdida: cantidad_perdida 
        })
        await mermasRepository.save(nuevaMerma);
        return [nuevaMerma, null];
    }catch(error) {
        console.error("Error al crear una merma", error)
    }
}

export async function getMermaService(id_merma) {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        //verificar que es una id

        const mermaEncontrada = await mermasRepository.findOne({
            where: {id_merma: id_merma}
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
            where: {id_merma : body.id_merma}
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
            {id_merma: body.id_merma},
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
            where: { id_merma: id}
        })
        if(!mermaEncontrada) {
            return [null, "No se encontro la merma especificada"]
        }
        const mermaEliminada = await mermasRepository.remove(mermaEncontrada);
        return [mermaEliminada, null];
    }catch(error) {
        console.log(error)
        return [null, "Error interno del servidor"]
    }
}