"use strict";
import { EntitySchema } from "typeorm";

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
            type: "time",
        },
        hora_fin: {
            type: "time"
        },
        dia_semana: {
            type: "varchar",
            length: 10
        }
    },
    relations: {
        horario_laboral: {
            type: "many-to-one",
            target: "horario_laboral",
            joinColumn: {
                name: "id_horario_laboral", // Llave foránea en horario_dia que apunta a horario_laboral
            },
            onDelete: "CASCADE" // Configura el borrado en cascada si se elimina un horario_laboral
        }
    }
});

export default horario_dia;
