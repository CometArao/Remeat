import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPedido } from "@services/pedido.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import useGetIngredientes from "../hooks/ingredientes/useGetIngredientes";
import useProveedores from "../hooks/proveedores/useGetProveedores";
import useUsers from "../hooks/users/useGetUsers";
import useGetUtensilios from "../hooks/utensilios/useGetUtensilio";
import { truncateToMinutes } from "../../../backend/src/utils/dateUtils.js";
import SeleccionConCantidad from '../components/Pedido/SeleccionConCantidad.jsx';
import utensilio from "../../../backend/src/entity/utensilio.entity.js";
import "@styles/crearPedido.css";

const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getYearRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const minDate = `${currentYear - 1}-01-01`;
    const maxDate = `${currentYear + 1}-12-31`;
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
        ingredientes: [], // { id_ingrediente, cantidad_ingrediente }
        utensilios: [] // { id_utensilio, cantidad_utensilio }
    });

    const [costoTotal, setCostoTotal] = useState(0);

    const { minDate, maxDate } = getYearRange();
    const administradores = users.filter(user => user.rol_usuario === "administrador");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPedidoData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateCostoTotal = () => {
        let total = 0;

        pedidoData.ingredientes.forEach((ing) => {
            const ingredienteInfo = ingredientes.find((i) => i.id_ingrediente === ing.id_ingrediente);
            if (ingredienteInfo && ingredienteInfo.costo_ingrediente) {
                total += ing.cantidad_ingrediente * ingredienteInfo.costo_ingrediente;
            }
        });

        pedidoData.utensilios.forEach((ut) => {
            const utensilioInfo = utensilios.find((u) => u.id_utensilio === ut.id_utensilio);
            if (utensilioInfo && utensilioInfo.costo_utensilio) {
                total += ut.cantidad_utensilio * utensilioInfo.costo_utensilio;
            }
        });

        setCostoTotal(total);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            (!pedidoData.ingredientes || pedidoData.ingredientes.length === 0) &&
            (!pedidoData.utensilios || pedidoData.utensilios.length === 0)
        ) {
            showErrorAlert("Error", "Debes seleccionar al menos un ingrediente o utensilio para crear un pedido.");
            return;
        }

        try {
            await createPedido({ ...pedidoData });
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
        calculateCostoTotal();
    }, [pedidoData, utensilios]);

    // Si aún no hay datos de ingredientes o utensilios, mostramos un mensaje de carga
    if (!ingredientes || !utensilios || ingredientes.length === 0 || utensilios.length === 0) {
        return <div>Cargando datos de ingredientes y utensilios...</div>;
    }

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
                    <label>Fecha y Hora de Compra</label>
                    <input
                        type="datetime-local"
                        name="fecha_compra_pedido"
                        value={pedidoData.fecha_compra_pedido}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Fecha y Hora de Entrega</label>
                    <input
                        type="datetime-local"
                        name="fecha_entrega_pedido"
                        value={pedidoData.fecha_entrega_pedido}
                        onChange={handleInputChange}
                        required
                        min={pedidoData.fecha_compra_pedido}
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

                {/* Uso del Form con estrategia similar a PopupPlatillo */}
                <div className="form-group">
  <label>Ingredientes</label>
  <SeleccionConCantidad
    options={ingredientes.map((i) => ({
      value: i.id_ingrediente,
      label: i.tipo_ingrediente.nombre_tipo_ingrediente
    }))}
    value={pedidoData.ingredientes.map((ing) => {
      const ingredienteInfo = ingredientes.find((i) => i.id_ingrediente === ing.id_ingrediente);
      return {
        value: ing.id_ingrediente,
        label: ingredienteInfo ? ingredienteInfo.tipo_ingrediente.nombre_tipo_ingrediente : "",
        cantidad: ing.cantidad_ingrediente
      };
    })}
    onChange={(newValues) => {
      const nuevosIngredientes = newValues.map((ing) => ({
        id_ingrediente: ing.value,
        cantidad_ingrediente: ing.cantidad
      }));
      setPedidoData((prev) => ({ ...prev, ingredientes: nuevosIngredientes }));
    }}
  />
</div>

<div className="form-group">
  <label>Utensilios</label>
  <SeleccionConCantidad
    options={utensilios.map((u) => ({
      value: u.id_utensilio,
      label: u.tipo_utensilio.nombre_tipo_utensilio
    }))}
    value={pedidoData.utensilios.map((ut) => {
      const utensilioInfo = utensilios.find((x) => x.id_utensilio === ut.id_utensilio);
      return {
        value: ut.id_utensilio,
        label: utensilioInfo ? utensilioInfo.tipo_utensilio.nombre_tipo_utensilio : "",
        cantidad: ut.cantidad_utensilio
      };
    })}
    onChange={(newValues) => {
      const nuevosUtensilios = newValues.map((ut) => ({
        id_utensilio: ut.value,
        cantidad_utensilio: ut.cantidad
      }));
      setPedidoData((prev) => ({ ...prev, utensilios: nuevosUtensilios }));
    }}
  />
</div>

                <div className="form-group">
                    <label>Costo Total del Pedido</label>
                    <p>${costoTotal.toFixed(2)}</p>
                </div>

                <button type="submit">Crear Pedido</button>
            </form>
        </div>
    );
};

export default CrearPedido;
