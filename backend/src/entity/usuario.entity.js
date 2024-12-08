import { EntitySchema } from "typeorm";

const usuarioSchema = new EntitySchema({
    name: "usuario",
    tableName: "usuario",
    columns: {
        id_usuario: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_usuario: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        apellido_usuario: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        correo_usuario: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true
        },
        contrasena_usuario: {
            type: "varchar",
            length: 255,
            nullable: false
        },
        rol_usuario: {
            type: "enum",
            enum: ["administrador", "cocinero", "mesero"],
            nullable: false
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
        comandas: {
            type: "one-to-many",
            target: "comanda",
            inverseSide: "usuario",
            cascade: true,
        },
        crea_platillos: {
            type: "one-to-many",
            target: "platillo",
            inverseSide: "creador",
            cascade: true,
        },
        pedidos: { // Relación con pedido
            type: "one-to-many",
            target: "pedido",
            inverseSide: "usuario",
        },
    },
});

export default usuarioSchema;
