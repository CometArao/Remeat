"use strict"
import { EntitySchema, JoinColumn} from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js"

const merma = new EntitySchema({
    name:"merma",
    tablename:"merma",
    columns: {
        id_merma: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: true
        },
        cantidad_perdida: {
            type: "int",
            nullable: true
        },
        //utensilio: {
            //type: "many-to-many",
            //target: "utensilio",
            //cascade: true
        //},
        //ingrediente: {//No se tiene join table cascading en uno de los lados pero se tiene que tener de ambos lados
            //type: "many-to-many",
            //target: "ingrediente",
        //}
    },
});

export default merma;