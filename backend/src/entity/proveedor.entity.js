"use strict";
import { EntitySchema } from "typeorm";

const proveedor = new EntitySchema({
    name: "proveedor",
    tableName: "proveedor",
    columns: {
        id_proveedor: {
            type: "int",
            primary: true,
            generated: true,
        },
        tipo_proveedor: {
            type: "varchar",
            length: "255",
            nullable: false
        },
        nombre_proveedor: {
            type: "varchar",
            nullable: false // Asegúrate de que este campo sea requerido
        },
        correo_proveedor: {
            type: "varchar",
            nullable: false // Asegúrate de que este campo sea requerido
        }
    },
    relations: {
        pedidos: { // Cambia el nombre a plural para reflejar que un proveedor puede tener múltiples pedidos
            type: "one-to-many", // Cambia a one-to-many
            target: "pedido", // Relación con la entidad Pedido
            mappedBy: "proveedor", // Indica que esta relación es mapeada por el campo proveedor en Pedido
            cascade: true // Si deseas que las operaciones en proveedor se propaguen a los pedidos
        }
    }
});

export default proveedor;