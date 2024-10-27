"use strict";
import horario_laboral_schema from "./horario_laboral.entity.js"
import { EntitySchema} from "typeorm";

const horario_dia = new EntitySchema({
    name: "horario_dia",
    tableName: "horario_dia",
    columns: {
        id_horario_dia: {
            type: "int",
            primary: true,
            generated: true,
        },
        hora_inicio: {
            type: "int",
        },
        hora_fin: {
            type: "int"
        },
        dia_semana: {
            type: "varchar",
            lenght: "miercoles".length
        }
    }
})
export default horario_dia;
