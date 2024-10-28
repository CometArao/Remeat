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
        id_usuario: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            onDelete: "SET NULL"
        },
    }
});

export default platillo;