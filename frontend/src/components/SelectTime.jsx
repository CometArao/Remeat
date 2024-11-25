import { useState, useImperativeHandle, forwardRef } from 'react';

const TableWithSingleCheckbox = forwardRef((data, ref) => {
    //los datos vienen en .data por alguna razon
    data = data.data
    console.log("data tiempo")
    console.log(data)

    // State to track the currently checked item ID
    const [checkedId, setCheckedId] = useState(null);

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setCheckedId((prevId) => (prevId === id ? null : id)); // Toggle checkbox or uncheck if it's already checked
    };
    const getSelectedTime = () => {
        return data[checkedId];
    };
    //Muestra getSelectedItem al padre
    useImperativeHandle(ref, () => ({
        getSelectedTime,
    }));
    return (
        <div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Variable Independiente</th>
                        <th>Checklist</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedId === item.id} // Only check the box if the current id matches checkedId
                                    onChange={() => handleCheckboxChange(item.id)}
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
TableWithSingleCheckbox.displayName = 'TableWithSingleCheckbox';
export default TableWithSingleCheckbox;