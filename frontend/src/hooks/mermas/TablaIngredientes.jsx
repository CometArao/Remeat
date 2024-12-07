import { useState, useImperativeHandle, forwardRef } from 'react';

const TableWithCheckboxes = forwardRef((data, ref) => {
    data = data.data
    console.log("data ingrediente")
    console.log(data)
    for(let i = 0; i < data.length; i++) {
        const item = data[i];
        if(!item.tipo_utensilio) {
            data.splice(i, 1); //eliminar el elemento sin datos de tipo
        }
    }
    console.log("data ingrediente revisado")
    console.log(data)
    const [checkedItems, setCheckedItems] = useState({});
    const [numeroIngrediente, setNumberoIngrediente] = useState({})

    const getSelectedItems = () => {
        console.log("numberoIngrediente")
        console.log(numeroIngrediente)
        return data.filter(item => (numeroIngrediente[item.id_ingrediente] != 0 && numeroIngrediente[item.id_ingrediente]));
    };
    const handleCheckboxChange = (id) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],  // Toggle the checked state
        }));
    };
    useImperativeHandle(ref, () => ({
        getSelectedItems,
    }));
    const handleSetNumberOfMermaIngrediente = (id, number) => {
        setNumberoIngrediente((prevState) => ({
            ...prevState,
            [id]: number,
        })
        )
    }
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
                    {data.map((item) => (
                        <tr key={item.id_ingrediente}>
                            <td>{item.tipo_ingrediente.nombre_tipo_ingrediente}</td>
                            <td>{item.pedido.fecha_compra_pedido}</td>
                            <td>{item.cantidad_ingrediente}</td>
                            <td>
                                <input
                                    type="number"
                                    value={numeroIngrediente[item.id_ingrediente] || 0}
                                    onChange={(e) => handleSetNumberOfMermaIngrediente(
                                        item.id_ingrediente, e.target.value)}
                                    min="0" // Valor mínimo permitido
                                    max={item.cantidad_ingrediente} // Valor máximo permitido
                                    step="1" // Incremento/decremento por 1
                                    style={{ width: "40px" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
// Set the displayName for better debugging
TableWithCheckboxes.displayName = 'TableWithCheckboxes';
export default TableWithCheckboxes;