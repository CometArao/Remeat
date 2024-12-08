"use strict";
import { EntitySchema } from "typeorm";

const platillo = new EntitySchema({
    name: "platillo",
    tableName: "platillo",
    columns: {
        id_platillo: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_platillo: {
            type: "varchar",
            length: "100",
            nullable: false
        },
        precio_platillo: {
            type: "int",
            nullable: false
        },
        disponible: {
            type: "boolean",
            default: true, // Por defecto, el platillo está disponible
            nullable: false
        },
        id_usuario: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        componePlatillo: {
            type: "one-to-many",
            target: "compuesto_platillo",
            inverseSide: "platillo",
        },
        creador: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            inverseSide: "crea_platillos",
            onDelete: "SET NULL"
        },
        menus: {
            type: "many-to-many",
            target: "menu",
            joinTable: true
        }
    }
});

export default platillo;
