import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPedido } from "@services/pedido.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import useGetIngredientes from "../hooks/ingredientes/useGetIngredientes";
import useProveedores from "../hooks/proveedores/useGetProveedores";
import useUsers from "../hooks/users/useGetUsers";
import useGetUtensilios from "../hooks/utensilios/useUtensilio";
import "@styles/crearPedido.css";

const CrearPedido = () => {
    const navigate = useNavigate();
    const { ingredientes, fetchIngredientes } = useGetIngredientes();
    const { proveedores, fetchProveedores } = useProveedores();
    const { users, fetchUsers } = useUsers();
    const { utensilios, fetchUtensilios } = useGetUtensilios();

    const [pedidoData, setPedidoData] = useState({
        descripcion_pedido: "",
        fecha_compra_pedido: "",
        fecha_entrega_pedido: "",
        costo_pedido: "",
        id_usuario: "",
        id_proveedor: "",
        ingredientes: [], // Para ingredientes seleccionados
        utensilios: [] // Para utensilios seleccionados
    });

    const administradores = users.filter(user => user.rol_usuario === "administrador");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPedidoData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIngredientesChange = (idIngrediente) => {
        setPedidoData((prev) => {
            const ingredientesActualizados = prev.ingredientes.includes(idIngrediente)
                ? prev.ingredientes.filter(id => id !== idIngrediente) // Quitar si ya estaba seleccionado
                : [...prev.ingredientes, idIngrediente]; // Agregar si no estaba
            return { ...prev, ingredientes: ingredientesActualizados };
        });
    };

    const handleUtensiliosChange = (idUtensilio) => {
        setPedidoData((prev) => {
            const utensiliosActualizados = prev.utensilios.includes(idUtensilio)
                ? prev.utensilios.filter(id => id !== idUtensilio) // Quitar si ya estaba seleccionado
                : [...prev.utensilios, idUtensilio]; // Agregar si no estaba
            return { ...prev, utensilios: utensiliosActualizados };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPedido(pedidoData); // Enviar con el formato esperado
            showSuccessAlert("¡Éxito!", "Pedido creado correctamente.");
            navigate("/pedidos");
        } catch (error) {
            console.error("Error al crear el pedido:", error);
            showErrorAlert("Error", "Hubo un problema al crear el pedido.");
        }
    };

    useEffect(() => {
        fetchIngredientes();
        fetchProveedores();
        fetchUsers();
        fetchUtensilios(); // Cargar utensilios
    }, []);

    return (
        <div className="crear-pedido-container">
            <form className="crear-pedido-form" onSubmit={handleSubmit}>
                <h1>Crear Pedido</h1>
                <div className="form-group">
                    <label>Descripción del Pedido</label>
                    <input
                        type="text"
                        name="descripcion_pedido"
                        value={pedidoData.descripcion_pedido}
                        onChange={handleInputChange}
                        placeholder="Ej: Pedido para evento especial"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Fecha de Compra</label>
                    <input
                        type="date"
                        name="fecha_compra_pedido"
                        value={pedidoData.fecha_compra_pedido}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Fecha de Entrega</label>
                    <input
                        type="date"
                        name="fecha_entrega_pedido"
                        value={pedidoData.fecha_entrega_pedido}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Costo del Pedido</label>
                    <input
                        type="number"
                        name="costo_pedido"
                        value={pedidoData.costo_pedido}
                        onChange={handleInputChange}
                        placeholder="Ej: 2500"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Usuario</label>
                    <select
                        name="id_usuario"
                        value={pedidoData.id_usuario}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Usuario</option>
                        {administradores.map((user) => (
                            <option key={user.id_usuario} value={user.id_usuario}>
                                {user.nombre_usuario} {user.apellido_usuario}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Proveedor</label>
                    <select
                        name="id_proveedor"
                        value={pedidoData.id_proveedor}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Proveedor</option>
                        {proveedores.map((prov) => (
                            <option key={prov.id_proveedor} value={prov.id_proveedor}>
                                {prov.nombre_proveedor}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Ingredientes</label>
                    {ingredientes.map((ing) => (
                        <div key={ing.id_ingrediente}>
                            <input
                                type="checkbox"
                                id={`ingrediente-${ing.id_ingrediente}`}
                                checked={pedidoData.ingredientes.includes(ing.id_ingrediente)}
                                onChange={() => handleIngredientesChange(ing.id_ingrediente)}
                            />
                            <label htmlFor={`ingrediente-${ing.id_ingrediente}`}>
                                {ing.tipo_ingrediente?.nombre_tipo_ingrediente || "Sin tipo"} - {ing.nombre_ingrediente}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label>Utensilios</label>
                    {utensilios.map((ut) => (
                        <div key={ut.id_utensilio}>
                            <input
                                type="checkbox"
                                id={`utensilio-${ut.id_utensilio}`}
                                checked={pedidoData.utensilios.includes(ut.id_utensilio)}
                                onChange={() => handleUtensiliosChange(ut.id_utensilio)}
                            />
                            <label htmlFor={`utensilio-${ut.id_utensilio}`}>
                                {ut.tipo_utensilio?.nombre_tipo_utensilio || "Sin tipo"} - {ut.id_utensilio}
                            </label>
                        </div>
                    ))}
                </div>
                <button type="submit">Crear Pedido</button>
            </form>
        </div>
    );
};

export default CrearPedido;
