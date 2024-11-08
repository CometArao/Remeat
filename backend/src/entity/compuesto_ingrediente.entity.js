"use strict"
import { EntitySchema } from "typeorm";

const compuestoIngrediente = new EntitySchema({
    name:"compuesto_ingrediente",
    tablename:"compuesto_ingrediente",
    columns: {
        id_ingrediente: {
            type: "int",
            primary: true,
        },
        id_pedido: {
            type: "int",
            primary: true,
        },
        costo_ingrediente: {
            type: "int"
        }
    },
    relations: {
        ingredinte: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "ingrediente",
            joinColumn: {
                name: "id_ingrediente"
            }
        },
        pedido: {
            type: "many-to-one",//tiene que ser many-to-one NO one-to-many
            target: "pedido",
            joinColumn: {
                name: "id_pedido"
            }
        }
    }
});

export default compuestoIngrediente