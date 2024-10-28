"use strict"
import { EntitySchema} from "typeorm";
import usuarioSchema from "./usuario.entity.js"

const compuestoPlatillo = new EntitySchema({
    name:"compuesto_platillo",
    tablename:"compuesto_platillo",
    columns: {
        id_tipo_ingrediente: {
            type: "int",
            primary: true,
        },
        id_platillo: {
            type: "int",
            primary: true,
        },
        porcion_ingrediente_platillo: {
            type: "int"
        }
    },
    relations: {
        tipo_ingrediente: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "tipo_ingrediente",
            joinColumn: {
                name: "id_tipo_ingrediente"
            }
        },
        platillo: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "platillo",
            joinColumn: {
                name: "id_platillo"
            }
        }
    }
});

export default compuestoPlatillo