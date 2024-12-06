"use strict"
import { EntitySchema } from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js";

const utensilio_merma = new EntitySchema({
    name: "utensilio_merma",
    tableName: "utensilio_merma",
    columns: {
        id_utensilio: {
            type: "int",
            primary: true,
        },
        id_merma: {
            type: "int",
            primary: true,
        },
        cantidad_perdida_utensilio: {
            type: "int"
        }
    },
    relations: {
        merma: {
            type: "many-to-one", 
            target: "merma",
            joinColumn: {
                name: "id_merma"
            }
        },
        utensilio: {
            type: "many-to-one", 
            target: "utensilio",
            joinColumn: {
                name: "id_utensilio"
            }
        }
    }
});

export default utensilio_merma;
