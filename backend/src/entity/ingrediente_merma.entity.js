"use strict"
import { EntitySchema } from "typeorm";
import tipo_utensilio from "./tipo_utensilio.entity.js";

const ingrediente_merma = new EntitySchema({
    name: "ingrediente_merma",
    tableName: "ingrediente_merma",
    columns: {
        id_utensilio: {
            type: "int",
            primary: true,
        },
        id_merma: {
            type: "int",
            primary: true,
        },
        cantidad_perdida_ingrediente: {
            type: "int",
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
        ingrediente: {
            type: "many-to-one", // Un platillo puede estar en múltiples comandas
            target: "ingrediente",
            joinColumn: {
                name: "id_utensilio"
            }
        }
    }
});

export default ingrediente_merma;
