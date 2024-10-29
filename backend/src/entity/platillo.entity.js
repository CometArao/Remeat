"use strict"
import { EntitySchema } from "typeorm";
import usuario from "./usuario.entity.js"

const platillo = new EntitySchema({
    name:"platillo",
    tableName:"platillo",
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
        id_cocinero: {
            type: "int",
            nullable: true
        },
        id_creador: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        cocinero: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_cocinero"
            },
            inverseSide: "cocina_platillos",
            onDelete: "SET NULL"
        },
        creador: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_creador"
            },
            inverseSide: "crea_platillos",
            onDelete: "SET NULL"
        },
    }
});

export default platillo;