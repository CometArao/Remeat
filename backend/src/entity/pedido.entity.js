"use strict";
import { EntitySchema } from "typeorm";

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
            nullable: false,
        },
        fecha_compra_pedido: {
            type: "timestamp",
            precision: 0, // Limita la precisión a segundos
            nullable: false,
        },
        estado_pedido: {
            type: "varchar",
            length: "20",
            nullable: false,
        },
        fecha_entrega_pedido: {
            type: "timestamp",
            precision: 0, // Limita la precisión a segundos
            nullable: false,
        },
        costo_pedido: {
            type: "int",
            nullable: false,
        },
        id_usuario: {
            type: "int",
            nullable: false,
        },
        id_proveedor: {
            type: "int",
            nullable: true,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: { name: "id_usuario" },
            onDelete: "SET NULL",
        },
        proveedor: {
            type: "many-to-one",
            target: "proveedor",
            joinColumn: { name: "id_proveedor" },
            onDelete: "SET NULL",
        },
        compuestoIngredientes: {
            type: "one-to-many",
            target: "compuesto_ingrediente",
            inverseSide: "pedido",
        },
    },
});

export default pedido;
