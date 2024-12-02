import { useState, useImperativeHandle, forwardRef} from 'react';

const TableWithCheckboxes = forwardRef((data, ref) => {
  // Sample data with names
  data = data.data
  console.log(data)
  // State to track checked status of checkboxes
  const [checkedItems, setCheckedItems] = useState({});

  const getSelectedItems = () => {
    return data.filter(item => checkedItems[item.id]);   
  };
  // Handle checkbox change
  const handleCheckboxChange = (id) => {
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
            <th>Elementos a analizar{/*TODO: Que salga el nombre del elemento ej platillo */}</th>
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
                  checked={!!checkedItems[item.id]}
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
TableWithCheckboxes.displayName = 'TableWithCheckboxes';
export default TableWithCheckboxes;