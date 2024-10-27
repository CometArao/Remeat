"use strict"
import { EntitySchema, JoinColumn} from "typeorm";
import horario_laboral from "./horario_laboral.entity.js";
//http://146.83.198.35:1289/api/user/all
const usuario = new EntitySchema({
    name:"usuario",
    tablename:"usuario",
    columns: {
        id_usuario: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_usuario: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        apellido_usuario: {
            type: "varchar"
        },
        correo_usuario: {
            type: "varchar"
        },
        contrasena_usuario: {
            type: "varchar"
        },
        rol_usuario: {
            type: "varchar"
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
        platillo: {
            type: "many-to-many",
            target: "platillo",
            joinTable: true,
            cascade: true,
        }
    }
});

export default usuario;