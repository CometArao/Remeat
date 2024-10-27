"use strict"
import { EntitySchema, JoinColumn} from "typeorm";
import usuario from "./usuario.entity.js"

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
        id_tipo_ingrediente: {
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
            type: "many-to-many",
            target: "pedido",
            joinTable: true,
            cascade: true
        }  
    }
});

export default ingrediente;