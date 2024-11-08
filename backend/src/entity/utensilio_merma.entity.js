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
            type: "many-to-one", // Una comanda puede tener múltiples platillos
            target: "merma",
            joinColumn: {
                name: "id_comanda"
            }
        },
        utensilio: {
            type: "many-to-one", // Un platillo puede estar en múltiples comandas
            target: "utensilio",
            joinColumn: {
                name: "id_utensilio"
            }
        }
    }
});

export default utensilio_merma;
