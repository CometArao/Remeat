"use strict"
import { EntitySchema} from "typeorm";
import usuario from "./usuario.entity.js"

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
            type: "int",
            nullable: false
        },
    },
});

export default tipo_utensilio;