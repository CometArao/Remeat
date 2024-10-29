"use strict"
import { EntitySchema, JoinColumn} from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js"

const merma = new EntitySchema({
    name:"merma",
    tablename:"merma",
    columns: {
        id_merma: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: true
        },
        cantidad_perdida: {
            type: "int",
            nullable: true
        }
    },
});

export default merma;