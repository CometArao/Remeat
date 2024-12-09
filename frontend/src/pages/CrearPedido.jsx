import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPedido } from "@services/pedido.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import useGetIngredientes from "../hooks/ingredientes/useGetIngredientes";
import useProveedores from "../hooks/proveedores/useGetProveedores";
import useUsers from "../hooks/users/useGetUsers";
import useGetUtensilios from "../hooks/utensilios/useGetUtensilio";
import "@styles/crearPedido.css";

// Obtener la fecha de hoy en formato "YYYY-MM-DD"
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
};

// Obtener el rango permitido para fechas
const getYearRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const minDate = `${currentYear - 1}-01-01`; // Año anterior
    const maxDate = `${currentYear + 1}-12-31`; // Año siguiente
    return { minDate, maxDate };
};

const CrearPedido = () => {
    const navigate = useNavigate();
    const { ingredientes, fetchIngredientes } = useGetIngredientes();
    const { proveedores, fetchProveedores } = useProveedores();
    const { users, fetchUsers } = useUsers();
    const { utensilios, fetchUtensilios } = useGetUtensilios();

    const [pedidoData, setPedidoData] = useState({
        descripcion_pedido: "",
        fecha_compra_pedido: getTodayDate(),
        fecha_entrega_pedido: "",
        id_usuario: "",
        id_proveedor: "",
        ingredientes: [], // { id_ingrediente, cantidad }
        utensilios: [] // { id_utensilio, cantidad }
    });

    const [selectedIngredientes, setSelectedIngredientes] = useState({});
    const [selectedUtensilios, setSelectedUtensilios] = useState({});
    const [costoTotal, setCostoTotal] = useState(0);

    const { minDate, maxDate } = getYearRange(); // Fechas límite para el rango

    const administradores = users.filter(user => user.rol_usuario === "administrador");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPedidoData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (type, id) => {
        const isIngredient = type === "ingredientes";
        const selectedState = isIngredient ? selectedIngredientes : selectedUtensilios;

        const updatedState = {
            ...selectedState,
            [id]: !selectedState[id], // Toggle selection
        };

        if (!updatedState[id]) {
            // Deseleccionado: eliminarlo de pedidoData y restablecer cantidad
            setPedidoData((prev) => ({
                ...prev,
                [type]: prev[type].filter((item) => item[`id_${type.slice(0, -1)}`] !== id),
            }));
        }

        isIngredient ? setSelectedIngredientes(updatedState) : setSelectedUtensilios(updatedState);
    };

    const handleCantidadChange = (type, id, cantidad) => {
        const key = type === "ingredientes" ? "cantidad_ingrediente" : "cantidad_utensilio";
    
        setPedidoData((prev) => {
            const updatedList = prev[type].filter((item) => item[`id_${type.slice(0, -1)}`] !== id);
            if (cantidad > 0) {
                updatedList.push({ [`id_${type.slice(0, -1)}`]: id, [key]: parseFloat(cantidad) });
            }
            return { ...prev, [type]: updatedList };
        });
    };
    
    

    const calculateCostoTotal = () => {
        let total = 0;
    
        // Calcular el costo total de ingredientes seleccionados
        pedidoData.ingredientes.forEach((ing) => {
            const ingredienteInfo = ingredientes.find((i) => i.id_ingrediente === ing.id_ingrediente);
            if (ingredienteInfo && ingredienteInfo.costo_ingrediente) {
                total += ing.cantidad_ingrediente * ingredienteInfo.costo_ingrediente; // Usar cantidad_ingrediente
            } else {
                console.warn(`Costo de ingrediente no encontrado para ID: ${ing.id_ingrediente}`);
            }
        });
    
        // Calcular el costo total de utensilios seleccionados
        pedidoData.utensilios.forEach((ut) => {
            const utensilioInfo = utensilios.find((u) => u.id_utensilio === ut.id_utensilio);
            if (utensilioInfo && ut.cantidad_utensilio) {
                total += ut.cantidad_utensilio * utensilioInfo.costo_utensilio; // Usar cantidad_utensilio
            } else {
                console.warn(`Costo de utensilio no encontrado para ID: ${ut.id_utensilio}`);
            }
        });
    
        setCostoTotal(total); // Actualizar el costo total en tiempo real
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validar que al menos un ingrediente o utensilio esté seleccionado
        if (
            (!pedidoData.ingredientes || pedidoData.ingredientes.length === 0) &&
            (!pedidoData.utensilios || pedidoData.utensilios.length === 0)
        ) {
            showErrorAlert("Error", "Debes seleccionar al menos un ingrediente o utensilio para crear un pedido.");
            return;
        }
    
        try {
            // Enviar datos al backend
            const response = await createPedido({ ...pedidoData });
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
        fetchUtensilios();
    }, []);

    useEffect(() => {
        console.log("Utensilios cargados:", utensilios); // Verificar datos cargados
        calculateCostoTotal(); // Recalcular costo total cada vez que cambien ingredientes o utensilios
    }, [pedidoData, utensilios]);

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
                        readOnly

                        // Descomentar para que se pueda cambiar la fecha de compra, y quitar readOnly
                        /*value={pedidoData.fecha_compra_pedido}
                        onChange={handleInputChange}
                        required
                        min={minDate}
                        max={maxDate}*/
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
                        min={pedidoData.fecha_compra_pedido} // No puede ser menor a la fecha de compra
                        max={maxDate}
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
                    {ingredientes.map(ing => (
                        <div key={ing.id_ingrediente} className="item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!selectedIngredientes[ing.id_ingrediente]}
                                    onChange={() => handleCheckboxChange("ingredientes", ing.id_ingrediente)}
                                />
                                ID: {ing.id_ingrediente} - Nombre: {ing.tipo_ingrediente.nombre_tipo_ingrediente}
                            </label>
                            {selectedIngredientes[ing.id_ingrediente] && (
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    onChange={(e) => handleCantidadChange("ingredientes", ing.id_ingrediente, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label>Utensilios</label>
                    {utensilios.map(ut => (
                        <div key={ut.id_utensilio} className="item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!selectedUtensilios[ut.id_utensilio]}
                                    onChange={() => handleCheckboxChange("utensilios", ut.id_utensilio)}
                                />
                                ID: {ut.id_utensilio} - Nombre: {ut.tipo_utensilio.nombre_tipo_utensilio}
                            </label>
                            {selectedUtensilios[ut.id_utensilio] && (
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    onChange={(e) => handleCantidadChange("utensilios", ut.id_utensilio, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label>Costo Total del Pedido</label>
                    <p>${costoTotal.toFixed(2)}</p> {/* Mostrar costo total calculado */}
                </div>
                <button type="submit">Crear Pedido</button>
            </form>
        </div>
    );
};

export default CrearPedido;
