"use strict";
import { EntitySchema } from "typeorm";

const comanda = new EntitySchema({
    name: "comanda",
    tableName: "comanda",
    columns: {
        id_comanda: {
            type: "int",
            primary: true,
            generated: true
        },
        fecha_compra_comanda: {
            type: "date",
            nullable: true
        },
        hora_compra_comanda: {
            type: "time",
            nullable: false
        },
        estado_comanda: {
            type: "varchar",
            length: 20,
            nullable: false
        },
        id_usuario: {
            type: "int",
            nullable: true // Se puede dejar como null para los casos donde no se asigne un cocinero aún
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            inverseSide: "comandas",
            onDelete: "SET NULL"
        }
    }
});

export default comanda;
