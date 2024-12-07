import { useState, useImperativeHandle, forwardRef } from 'react';

//Solo puede ir un argumento junto a ref
//este argumento luego debe ser destructurado
const TableWithCheckboxes = forwardRef((data, ref) => {
    data = data.data
    console.log("data utensilio")
    console.log(data)
    //comprobar los nulos en tipo
    for(let i = 0; i < data.length; i++) {
        const item = data[i];
        if(!item.tipo_utensilio) {
            data.splice(i, 1); //eliminar el elemento sin datos de tipo
        }
    }
    console.log("data utensilio revisado")
    console.log(data)
    const [checkedItems, setCheckedItems] = useState({});
    const [numeroUtensilio, setNumeroUtensilio] = useState({})

    const getSelectedItems = () => {
        let selectedData = data.filter(
            item => (numeroUtensilio[item.id_utensilio] != 0 
                && numeroUtensilio[item.id_utensilio]));
        for(let i = 0; i < selectedData.length; i++) {
            selectedData[i].cantidad_perdida = Number(numeroUtensilio[selectedData[i].id_utensilio])
        }
        return selectedData;
    };
    const handleCheckboxChange = (id) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],  // Toggle the checked state
        }));
    };
    const handleSetNumberOfMermaUtensilio = (id, number) => {
        console.log("handleNumber")
        console.log(id)
        console.log(numeroUtensilio)
        setNumeroUtensilio((prevState) => ({
            ...prevState,
            [id]: number,
        })
        )
    }
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
                    {data.map((item) => (
                        <tr key={item.id_tipo_utensilio}>
                            <td>{item.tipo_utensilio.nombre_tipo_utensilio}</td>
                            <td>{item.pedido.fecha_compra_pedido}</td>
                            <td>{item.cantidad_utensilio}</td>
                            <td>
                                <input
                                    type="number"
                                    value={numeroUtensilio[item.id_utensilio] || 0}
                                    onChange={(e) => handleSetNumberOfMermaUtensilio(
                                        item.id_utensilio, e.target.value)}
                                    min="0" // Valor mínimo permitido
                                    max={item.cantidad_utensilio} // Valor máximo permitido
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