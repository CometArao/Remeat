"use strict"
import { EntitySchema } from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js";

const utensilio = new EntitySchema({
    name: "utensilio",
    tableName: "utensilio",
    columns: {
        id_utensilio: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad_utensilio: {
            type: "int",
            nullable: true,
        },
        costo_utensilio: {
            type: "int",
        },
        id_tipo_utensilio: {
            type: "int",
            nullable: true,
        },
        id_pedido: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        tipo_utensilio: {
            type: "many-to-one",
            target: "tipo_utensilio",
            joinColumn: {
                name: "id_tipo_utensilio",
            },
            onDelete: "SET NULL",
        },
        pedido: {
            type: "many-to-one",
            target: "pedido",
            joinColumn: {
                name: "id_pedido",
            },
            onDelete: "SET NULL",
        },
    }
});

export default utensilio;
