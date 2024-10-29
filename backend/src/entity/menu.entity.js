"use strict"
import { EntitySchema } from "typeorm";

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
            type: "boolean",
        },
        id_usuario: {
            type: "int",
            nullable: false
        },
    },
    relations: {
        platillo: {
            type: "many-to-many",
            target: "platillo",
            joinTable: true,
            cascade: true
        },
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario",
              },
        }
    }
});

export default menu;