import { useState, useImperativeHandle, forwardRef } from 'react';

const tableChecklistColumns = forwardRef((arg, ref) => {
    console.log(arg)
    const { data, columns } = arg.arg
    const { ingredientes, tipo_ingrediente } = data;
    console.log(tipo_ingrediente)
    console.log("data")
    console.log(data)
    console.log("columns")
    console.log(columns)
    // State to track checked status of checkboxes
    const [checkedItems, setCheckedItems] = useState({});

    // Function to get selected items based on checked checkboxes
    const getSelectedItems = () => {
        return data.filter(item => checkedItems[item.id]);
    };

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        console.log("checkedItems")
        console.log(checkedItems)
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],  // Toggle the checked state
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
                        {/* Checkbox for selecting rows */}
                        <th>Seleccionar</th>
                        {columns.map((column) => (
                            <th key={column.field}>{column.title}</th> // Use column label as header
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ingredientes.map((item) => (
                        <tr key={item.id_ingrediente}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!checkedItems[item.id_ingrediente]}
                                    onChange={() => handleCheckboxChange(item.id_ingrediente)}
                                />
                            </td>
                            <td>{item.fecha_vencimiento}</td>
                            <td>{item.cantidad_ingrediente}</td>
                            <td>{item.cantidad_original_ingrediente}</td>
                            <td>{item.costo_ingrediente}</td>
                            <td>{item.id_tipo_ingrediente}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

// Set the displayName for better debugging
tableChecklistColumns.displayName = 'tableChecklistColumns';

export default tableChecklistColumns;