"use strict";
import { EntitySchema } from "typeorm";

const ingrediente = new EntitySchema({
  name: "ingrediente",
  tableName: "ingrediente",
  columns: {
    id_ingrediente: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha_vencimiento: {
      type: "date",
      nullable: false,
    },
    cantidad_ingrediente: {
      type: "int",
      nullable: false,
    },
    cantidad_original_ingrediente: {
      type: "int",
      nullable: false,
    },
    costo_ingrediente: {
      type: "int",
    },
    id_tipo_ingrediente: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    tipo_ingrediente: {
      type: "many-to-one",
      target: "tipo_ingrediente",
      joinColumn: { name: "id_tipo_ingrediente" },
      onDelete: "SET NULL",
    },
    compuesto_ingrediente: {
      type: "one-to-many",
      target: "compuesto_ingrediente",
      inverseSide: "ingrediente",
      onDelete: "CASCADE",
    },
  },
});

export default ingrediente;
