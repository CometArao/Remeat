"use strict";
import { EntitySchema } from "typeorm";
import usuario from "./usuario.entity.js";

const pedido = new EntitySchema({
    name: "pedido",
    tableName: "pedido",
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
            type: "date",
            nullable: false
        },
        estado_pedido: {
            type: "varchar",
            length: "20", 
            nullable: false
        },
        fecha_entrega_pedido: {
            type: "date",
            nullable: false
        },
        costo_pedido: {
            type: "int",
            nullable: false
        },
        id_usuario: {
            type: "int",
            nullable: false
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
