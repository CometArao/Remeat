"use strict"
import { EntitySchema} from "typeorm";
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
    },
    relations: {
        tipo_utensilio: {
            type: "one-to-many",
            target: "tipo_utensilio",
            joinTable: true,
            cascade: true
        },
        pedido: {
            type: "many-to-many",
            target: "pedido",
            joinTable: true,
            cascade: true
        }
    }
});

export default utensilio;