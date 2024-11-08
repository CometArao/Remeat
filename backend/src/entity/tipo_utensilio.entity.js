"use strict"
import { EntitySchema } from "typeorm";

const tipo_utensilio = new EntitySchema({
    name:"tipo_utensilio",
    tablename:"tipo_utensilio",
    columns: {
        id_tipo_utensilio: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_tipo_utensilio: {
            type: "varchar",
            length: "50",
            unique: true
        },
    },
});

export default tipo_utensilio;