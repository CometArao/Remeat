"use strict";

import { EntitySchema } from "typeorm";

const notificacion = new EntitySchema({
    name: "notificacion",
    tableName: "notificacion",
    columns: {
        id_notificacion: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_notificacion: {
            type: "date",
            nullable: false,
        },
        hora_notificacion: {
            type: "time",
            nullable: false,
        },
        mensaje_notificacion: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        id_usuario: {
            type: "int",
            nullable: false,
        },
        resuelto_notificacion: {
            type: "boolean",
            nullable: false,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario",
            },
            inverseSide: "notificaciones",
            onDelete: "CASCADE",
        },
    },
});

export default notificacion;
