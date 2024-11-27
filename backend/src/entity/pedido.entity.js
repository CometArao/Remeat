"use strict";
import { EntitySchema } from "typeorm";

const pedido = new EntitySchema({
    name: "pedido",
    tableName: "pedido",
    columns: {
        id_pedido: {
            type: "int",
            primary: true,
            generated: true,
        },
        descripcion_pedido: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        fecha_compra_pedido: {
            type: "date",
            nullable: false
        },
        estado_pedido: {
            type: "varchar",
            length: "20", 
            nullable: false
        },
        fecha_entrega_pedido: {
            type: "date",
            nullable: false
        },
        costo_pedido: {
            type: "int",
            nullable: false
        },
        id_usuario: {
            type: "int",
            nullable: false
        },
        id_proveedor:{ // Agregar el ID del proveedor
            type:"int",
            nullable:true // Puede ser nulo si no hay proveedor asignado inicialmente
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "usuario",
            joinColumn: {
                name: "id_usuario"
            },
            onDelete: "SET NULL",
        },
        proveedor:{ // Agregar la relación con el proveedor
            type:"many-to-one", // Un pedido tiene un solo proveedor
            target:"proveedor",
            joinColumn:{
                name:"id_proveedor"
            }, 
            onDelete:"SET NULL" // O 'CASCADE' según tu lógica de negocio
        },
        utensilios:{
            type:"one-to-many",
            target:"utensilio",
            inverseSide:"pedido"
        },
        utensilios:{
            type:"one-to-many",
            target:"utensilio",
            inverseSide:"pedido"
        }
    }
});

export default pedido;
