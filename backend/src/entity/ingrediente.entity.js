"use strict"
import { EntitySchema} from "typeorm";
import usuario from "./usuario.entity.js"

const ingrediente = new EntitySchema({
    name:"ingrediente",
    tablename:"ingrediente",
    columns: {
        id_ingrediente: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_vencimiento: {
            type: "date",
            nullable: false
        },
        cantidad_ingrediente: {
            type: "int",
            nullable: false
        },
    },
    relations: {
        tipo_ingrediente: {
            type: "one-to-many",
            target: "tipo_ingrediente",
            joinTable: true,
            cascade: true
        },
        pedido: {
            type: "many-to-many",
            target: "pedido",
            joinTable: true,
            cascade: true
        }  
    }
});

export default ingrediente;