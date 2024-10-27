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
        },
        id_horario_dia: {
            type: "int",
            nullable: true,
        },
    },
    relations: {
        horario_dia: {
            type: "many-to-one",
            target: "horario_dia",
            joinColumn: {
                name: "id_horario_dia"
            },
            onDelete: "SET NULL"
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