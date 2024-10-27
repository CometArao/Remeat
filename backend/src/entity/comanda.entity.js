"use strict"
import { EntitySchema} from "typeorm";
import usuarioSchema from "./usuario.entity.js"

const comandaSchema = new EntitySchema({
    name:"comandas",
    tablename:"comandas",
    columns: {
        id_comandas: {
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
        validado_comanda: {
            type: "int"
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