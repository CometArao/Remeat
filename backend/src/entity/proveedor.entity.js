"use strict"
import { EntitySchema } from "typeorm";


const proveedor = new EntitySchema({
    name:"proveedor",
    tablename:"proveedor",
    columns: {
        id_proveedor: {
            type: "int",
            primary: true,
            generated: true,
        },
        tipo_proveedor: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        nombre_proveedor: {
            type: "varchar"
        },
        correo_proveedor: {
            type: "varchar"
        }
    },
    relations: {
        proveedor: {
            type: "many-to-many",
            target: "proveedor",
            joinTable: true,
            cascade: true
        }
    }
});

export default proveedor;