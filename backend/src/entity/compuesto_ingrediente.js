"use strict";
import { EntitySchema } from "typeorm";

const compuestoIngrediente = new EntitySchema({
    name: "compuesto_ingrediente",
    tableName: "compuesto_ingrediente",
    columns: {
        id_pedido: {
            type: "int",
            primary: true,
            nullable: false,
        },
        id_ingrediente: {
            type: "int",
            primary: true,
        },
        cantidad_pedida: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        pedido: {
            type: "many-to-one",
            target: "pedido",
            joinColumn: { name: "id_pedido" },
        },
        ingrediente: {
            type: "many-to-one",
            target: "ingrediente",
            joinColumn: { name: "id_ingrediente" },
            onDelete: "CASCADE",
        },
    },
});

export default compuestoIngrediente;
