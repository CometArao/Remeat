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
        id_usuario: {
            type: "int",
            nullable: true
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            onDelete: "SET NULL",
        },
    }
});

export default pedido;