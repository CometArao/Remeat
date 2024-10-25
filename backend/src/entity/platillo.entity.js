"use strict"
import { EntitySchema} from "typeorm";
import usuario from "./usuario.entity.js"

const platillo = new EntitySchema({
    name:"platillo",
    tablename:"platillo",
    columns: {
        id_platillo: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_platillo: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        precio_platillo: {
            type: "int"
        },
    },
    relations: {
        usuario: {
            type: "one-to-many",
            target: "usuario",
            joinTable: true,
            cascade: true
        },
        comandas: {
            type: "many-to-many",
            target: "comandas",
            joinTable: true,
            cascade: true
        }
    }
});

export default platillo;