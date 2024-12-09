"use strict";
import { EntitySchema } from "typeorm";

const utensilio = new EntitySchema({
    name: "utensilio",
    tableName: "utensilio",
    columns: {
        id_utensilio: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad_utensilio: {
            type: "int",
            nullable: true,
        },
        costo_utensilio: {
            type: "int",
        },
        id_tipo_utensilio: {
            type: "int",
            nullable: true,
        },
    },
    relations: {
        tipo_utensilio: {
            type: "many-to-one",
            target: "tipo_utensilio",
            joinColumn: {
                name: "id_tipo_utensilio",
            },
            onDelete: "SET NULL",
        },
        pedido: {
            type: "many-to-many", // Ajusta según la relación real
            target: "pedido",
            joinTable: {
                name: "utensilio_pedido",
                joinColumn: { name: "id_utensilio", referencedColumnName: "id_utensilio" },
                inverseJoinColumn: { name: "id_pedido", referencedColumnName: "id_pedido" },
            },
        },
    },
});

export default utensilio;
