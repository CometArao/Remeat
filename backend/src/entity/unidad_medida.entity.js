"use strict"
import { EntitySchema } from "typeorm";


const unidad_medida = new EntitySchema({
    name:"unidad_medida",
    tablename:"unidad_medida",
    columns: {
        id_unidad_medida: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_unidad_medida: {
            type: "varchar",
            length: "255",
            nullable: false
        },
    },
});

export default unidad_medida;