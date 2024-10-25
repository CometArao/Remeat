"use strict"
import { EntitySchema} from "typeorm";
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
    },
    relations: {
        unidad_medida: {
            type: "one-to-many",
            target: "unidad_medida",
            joinTable: true,
            cascade: true
        },
        //TODO: Como hacer atributos en una relacion
    }
});
export default tipo_ingrediente;