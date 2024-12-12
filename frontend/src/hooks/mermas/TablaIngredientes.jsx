import { useState, useImperativeHandle, forwardRef } from "react";

const TableWithCheckboxes = forwardRef((props, ref) => {
    //data = data.data; // Desestructuración del argumento
    // console.log("data ingrediente");
    // console.log(data);
    // for (let i = 0; i < data.length; i++) {
    // const item = data[i];
    // if (!item.tipo_ingrediente) {
    // data.splice(i, 1); // Eliminar el elemento sin datos de tipo
    // }
    // }
    // console.log("data ingrediente revisado");
    // console.log(data);

    const [checkedItems, setCheckedItems] = useState({});
    const [numeroIngrediente, setNumeroIngrediente] = useState({});

    const getSelectedItems = () => {
        const selectedData = props.filter(
            (item) =>
                numeroIngrediente[item.id_ingrediente] !== 0 &&
                numeroIngrediente[item.id_ingrediente]
        );
        for (let i = 0; i < selectedData.length; i++) {
            selectedData[i].cantidad_perdida = Number(
                numeroIngrediente[selectedData[i].id_ingrediente]
            );
        }
        return selectedData;
    };

    const handleCheckboxChange = (id) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Toggle the checked state
        }));
    };

    const handleSetNumberOfMermaIngrediente = (id, number) => {
        setNumeroIngrediente((prevState) => ({
            ...prevState,
            [id]: number,
        }));
    };

    useImperativeHandle(ref, () => ({
        getSelectedItems,
    }));

    return (
        <div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha Compra</th>
                        <th>Cantidad Restante</th>
                        <th>Checklist</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item) => 
                        item.tipo_ingrediente.nombre_tipo_ingrediente.toLowerCase().startsWith(props.filtro) ? (
                            <tr key={item.id_ingrediente}>
                                <td>
                                    {item.tipo_ingrediente?.nombre_tipo_ingrediente || "Sin tipo"}
                                </td>
                                <td>
                                    {item.pedido?.fecha_compra_pedido || "Sin fecha"}
                                </td>
                                <td>{item.cantidad_ingrediente || 0}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={numeroIngrediente[item.id_ingrediente] || 0}
                                        onChange={(e) =>
                                            handleSetNumberOfMermaIngrediente(
                                                item.id_ingrediente,
                                                e.target.value
                                            )
                                        }
                                        min="0" // Valor mínimo permitido
                                        max={item.cantidad_ingrediente || 0} // Valor máximo permitido
                                        step="1" // Incremento/decremento por 1
                                        style={{ width: "40px" }}
                                    />
                                </td>
                            </tr>
                        ) : null
                    )}
                </tbody>
            </table>
        </div>
    );
});

// Set the displayName para mejor depuración
TableWithCheckboxes.displayName = "TableWithCheckboxes";
export default TableWithCheckboxes;
