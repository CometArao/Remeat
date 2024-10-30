import Mermas from "../entity/merma.entity.js"
import { AppDataSource } from "../config/configDb.js";



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

export async function getMermasService() {
    try {
        const mermasRepository = AppDataSource.getRepository(Mermas);
        //declara una funcion con dos parametros que devuelve un diccionario(hashset) con esos dos parametros
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