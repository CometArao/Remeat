"use strict"
<<<<<<< HEAD
import { EntitySchema, JoinColumn } from "typeorm";

=======
import { EntitySchema } from "typeorm";
import usuario from "./usuario.entity.js"
>>>>>>> origin/main

const ingrediente = new EntitySchema({
    name:"ingrediente",
    tablename:"ingrediente",
    columns: {
        id_ingrediente: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_vencimiento: {
            type: "date",
            nullable: false
        },
        cantidad_ingrediente: {
            type: "int",
            nullable: false
        },
        cantidad_original_ingrediente: {
            type: "int",
            nullable: false
        },
        costo_ingrediente: {
            type: "int"
        },
        id_tipo_ingrediente: {
            type: "int",
            nullable: true
        },
        id_pedido: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        tipo_ingrediente: {
            type: "many-to-one",
            target: "tipo_ingrediente",
            joinColumn: {
                name: "id_tipo_ingrediente"
            },
            onDelete: "SET NULL",
        },
        pedido: {
            type: "many-to-one",
            target: "pedido",
            joinColumn: {
                name: "id_pedido"
            },
            onDelete: "SET NULL",
        },
    }
});

export default ingrediente;