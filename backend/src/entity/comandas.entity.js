"use strict"
import { EntitySchema} from "typeorm";
import usuario from "./usuario.entity.js"

const comandas = new EntitySchema({
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
        }
    },
    relations: {
        usuario: {
            type: "one-to-many",
            target: "usuario",
            joinTable: true,
            cascade: true
        }
    }
});

export default comandas;