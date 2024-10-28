"use strict"
import { EntitySchema} from "typeorm";
import usuarioSchema from "./usuario.entity.js"

const comandaSchema = new EntitySchema({
    name:"comanda",
    tablename:"comanda",
    columns: {
        id_comanda: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_compra_comanda: {
            type: "date",
            nullable: false
        },
        hora_compra_comanda: {
            type: "int"
        },
        estado: {
            type: "varchar"//
        },
        id_usuario: {
            type: "int", 
            nullable: true
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            onDelete: "SET NULL",
        }
    }
});

export default comandaSchema;