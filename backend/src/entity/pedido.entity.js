"use strict"
import { EntitySchema } from "typeorm";
import usuario from "./usuario.entity.js"

const pedido = new EntitySchema({
    name: "pedido",
    tablename: "pedido",
    columns: {
        id_pedido: {
            type: "int",
            primary: true,
            generated: true,
        },
        descripcion_pedido: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        fecha_compra_pedido: {
            type: "date"
        },
        estado_pedido: {
            type: "int"
        },
        fecha_entrega_pedido: {
            type: "date"
        },
        costo_perdido: {
            type: "int"
        },
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

export default pedido;