"use strict";
import { EntitySchema } from "typeorm";

const menu = new EntitySchema({
    name: "menu",
    tableName: "menu",
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
            default: true // Por defecto, el menú está disponible
        },
        id_usuario: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        platillo: {
            type: "many-to-many",
            target: "platillo",
            joinTable: true, // TypeORM creará automáticamente la tabla intermedia
            cascade: true // Permite guardar cambios en platillos cuando se actualiza el menú
        },
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            onDelete: "CASCADE" // Elimina el menú si el usuario asociado se elimina
        }
    }
});

export default menu;
