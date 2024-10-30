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
        id_tipo_utensilio: {
            type: "int",
            nullable: true,
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
        merma: {
            type: "many-to-many",
            target: "merma",
            joinTable: true,
            cascade: true,
        }
    }
});

export default utensilio;
