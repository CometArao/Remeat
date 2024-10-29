"use strict";
import { EntitySchema } from "typeorm";

const horario_laboral = new EntitySchema({
    name: "horario_laboral",
    tableName: "horario_laboral",
    columns: {
        id_horario_laboral: {
            type: "int",
            primary: true,
            generated: true,
        },
        descripcion: {
            type: "varchar",
            length: 255,
            nullable: false
        }
    },
    relations: {
        horario_dia: {
            type: "one-to-many",
            target: "horario_dia",
            inverseSide: "horario_laboral",
            cascade: true,
        }
    }
});

export default horario_laboral;