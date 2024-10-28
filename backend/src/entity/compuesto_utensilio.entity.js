"use strict"
import { EntitySchema} from "typeorm";
import usuarioSchema from "./usuario.entity.js"

const compuestoUtensilio = new EntitySchema({
    name:"compuesto_utensilio",
    tablename:"compuesto_utensilio",
    columns: {
        id_pedido: {
            type: "int",
            primary: true,
        },
        id_utensilio: {
            type: "int",
            primary: true,
        },
        costo_utensilio: {
            type: "int"
        }
    },
    relations: {
        pedido: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "pedido",
            joinColumn: {
                name: "id_pedido"
            }
        },
        utensilio: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "utensilio",
            joinColumn: {
                name: "id_utensilio"
            }
        }
    }
});

export default compuestoUtensilio