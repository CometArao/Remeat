"use strict"
import { EntitySchema } from "typeorm";
import usuario from "./usuario.entity.js"

const tipo_ingrediente = new EntitySchema({
    name:"tipo_ingrediente",
    tablename:"tipo_ingrediente",
    columns: {
        id_tipo_ingrediente: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_tipo_ingrediente: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        cantidad_alerta_tipo_ingrediente: {
            type: "int",
            nullable: false
        },
        id_unidad_medida: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        unidad_medida: {
            type: "many-to-one",
            target: "unidad_medida",
            joinColumn: {
                name: "id_unidad_medida"
            },
            onDelete: "SET NULL"
        },
       
    }
});
export default tipo_ingrediente;