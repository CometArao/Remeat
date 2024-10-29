"use strict"
import { EntitySchema, JoinColumn } from "typeorm";
import horario_laboral from "./horario_laboral.entity.js";
import platillo from "./platillo.entity.js";

const usuarioSchema = new EntitySchema({
    name:"usuario",
    tableName:"usuario",
    columns: {
        id_usuario: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_usuario: {
            type: "varchar",
            length: "50",
            nullable: false
        },
        apellido_usuario: {
            type: "varchar",
            length: "50",
            nullable: false
        },
        correo_usuario: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true
        },
        contrasena_usuario: {
            type: "varchar",
            length: 255,
            nullable: false
        },
        rol_usuario: {
            type: "enum",
            enum: ["administrador", "cocinero", "mesero"],
            nullable: false
        },
        id_horario_laboral: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        horario_laboral: {
            type: "many-to-one",
            target: "horario_laboral",
            joinColumn: {
                name: "id_horario_laboral",
            },
            onDelete: "SET NULL",
        },
        cocina_platillos: {
            type: "one-to-many",
            target: "platillo",
            inverseSide: "cocinero",
            cascade: true,
        },
        crea_platillos: {
            type: "one-to-many",
            target: "platillo",
            inverseSide: "creador",
            cascade: true,
        }
    }
});

export default usuarioSchema;