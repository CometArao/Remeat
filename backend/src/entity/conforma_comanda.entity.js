"use strict";
import { EntitySchema } from "typeorm";

const conformaComanda = new EntitySchema({
    name: "conforma_comanda",
    tableName: "conforma_comanda",
    columns: {
        id_comanda: {
            type: "int",
            primary: true,
        },
        id_platillo: {
            type: "int",
            primary: true,
        },
        estado_platillo: {
            type: "varchar",
            length: 20
        }
    },
    relations: {
        comanda: {
            type: "many-to-one", // Una comanda puede tener múltiples platillos
            target: "comanda",
            joinColumn: {
                name: "id_comanda"
            }
        },
        platillo: {
            type: "many-to-one", // Un platillo puede estar en múltiples comandas
            target: "platillo",
            joinColumn: {
                name: "id_platillo"
            }
        }
    }
});

export default conformaComanda;
