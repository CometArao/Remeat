"use strict"
import { EntitySchema} from "typeorm";
import horario_dia from "./horario_dia.entity.js"

const menu = new EntitySchema({
    name:"menu",
    tablename:"menu",
    columns: {
        id_menu: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: false
        },
        disponibilidad: {
            type: "int"
        }
    },
    relations: {
        horario_dia: {
            type: "one-to-many",
            target: "horario_dia",
            joinTable: true,
            cascade: true
        },
        platillo: {
            type: "many-to-many",
            target: "platillo",
            joinTable: true,
            cascade: true
        },
        usuario: {
            type: "many-to-many",
            target: "usuario",
            joinTable: true,
            cascade: true
        }
    }
});

export default menu;