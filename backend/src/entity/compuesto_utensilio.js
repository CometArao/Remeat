"use strict";
import { EntitySchema } from "typeorm";

const compuestoUtensilio = new EntitySchema({
    name: "compuesto_utensilio",
    tableName: "compuesto_utensilio",
    columns: {
        id_pedido: {
            type: "int",
            primary: true,
        },
        id_utensilio: {
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
            onDelete: "CASCADE",
        },
        utensilio: {
            type: "many-to-one",
            target: "utensilio",
            joinColumn: { name: "id_utensilio" },
            onDelete: "CASCADE",
        },
    },
});

export default compuestoUtensilio;
