"use strict"
import { EntitySchema} from "typeorm";
//import horario_dia from "./horario_dia.entity.js";
import horario_dia from "./horario_dia.entity.js"
//import { Entity, JoinTable, ManyToMany} from "typeorm";

//@Entity()
//export class horario_laboral {
    //@Column({type: "int", primary: true})
    //id_horario_laboral; 
    //@Column({type: "varchar"})
    //descripcion
    ////este lado no es propietario de la relacion por lo que no
    ////es nesesario poner @manytomany
//}

const horario_laboral = new EntitySchema({
    name:"horario_laboral",
    tablename:"horario_laboral",
    columns: {
        id_horario_laboral: {
            type: "int",
            primary: true,
            generated: true,
        },
        descripcion: {
            type: "varchar",
            length: "255",
            nullable: false
        }
    },
    relations: {
        horario_dia: {
            type: "many-to-many",
            target: "horario_dia",
            joinTable: true,
            cascade: true
        }
    }
});

export default horario_laboral;