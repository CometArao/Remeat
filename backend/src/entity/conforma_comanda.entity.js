"use strict"
import { EntitySchema} from "typeorm";
import usuarioSchema from "./usuario.entity.js"

const conformaComanda = new EntitySchema({
    name:"conforma_comanda",
    tablename:"conforma_comanda",
    columns: {
        id_comanda: {
            type: "int",
            primary: true,
        },
        id_platillo: {
            type: "int",
            primary: true,
        },
        estado_platillo: {
            type: "varchar",
            length: "20"
        }
    },
    relations: {
        comanda: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "comanda",
            joinColumn: {
                name: "id_comanda"
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

export default conformaComanda;