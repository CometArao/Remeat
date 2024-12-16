"use strict";
import { EntitySchema } from "typeorm";

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
        cantidad_restante_utensilio: {
            type: "int"
        },
        costo_utensilio: {
            type: "int",
        },
        id_tipo_utensilio: {
            type: "int",
            nullable: true,
        },
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
        compuestoUtensilio: {
            type: "one-to-many",
            target: "compuesto_utensilio",
            inverseSide: "utensilio",
            onDelete: "CASCADE",
        },
    },
});

export default utensilio;
