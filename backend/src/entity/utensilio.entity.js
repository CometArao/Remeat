"use strict"
import { EntitySchema, JoinColumn} from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js"

const utensilio = new EntitySchema({
    name:"utensilio",
    tablename:"utensilio",
    columns: {
        id_utensilio: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad_utensilio: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        id_tipo_utensilio: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        tipo_utensilio: {
            type: "many-to-one",
            target: "tipo_utensilio",
            JoinColumn: {
                name: "id_tipo_utensilio"
            },
            onDelete: "SET NULL",
        },
    }
});

export default utensilio;