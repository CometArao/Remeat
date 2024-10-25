"use strict";
import horario_laboral_schema from "./horario_laboral.entity.js"
//import {Entity, PrimaryGeneratorColumn, Column } from "typeorm"
//import { Entity, JoinTable, ManyToMany} from "typeorm";
import { EntitySchema} from "typeorm";

//@Entity()
//export class horario_dia {
    //@Column({type: "int", primary: true})
    //id_horario_dia; 
    //@Column({type: "int"})
    //hora_inicio
    //@Column({type: "int"})
    //hora_fin
    //@Column({type: "varchar"})
    //dia_semana
    //@ManyToMany(() => horario_laboral)
    //@JoinTable()
    //horario_laboral_atributo // : horario_labora[] //sale que es un array en la documentacion
//}


//}


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
        //relations: {
            //horario_laboral_schema: {
                //type: "many-to-many",
                //target: "horario_laboral",
                //JoinTable: true,
                //cascade: true
            //}
        //}
    }
})
export default horario_dia;