import React, {useState, useEffect } from "react";
import Select from "react-select";
import axios from "../../services/root.service";

const PlatillosSelect = ({ value, onChange }) => {
    const [platillosSeleccionados, setPlatillosSeleccionados] = useState([]);
    
    useEffect(() => {
        const obtenerPlatillos = async () => {
        try {
            const response = await axios.get("/platillos/");
            const opciones = response.data.data.map((platillo) => ({
            value: platillo.id_platillo,
            label: platillo.nombre_platillo,
            }));
            setPlatillosSeleccionados(opciones);
        }
        catch (error) {
            console.error("Error al obtener los platillos:", error);
        }
        };
        obtenerPlatillos();
    }
    , []);

    // Estilos personalizados para react-select

    const customStyles = {
        control: (base) => ({
        ...base,
        minHeight: "35px",
        fontSize: "14px",
        }),
        valueContainer: (base) => ({
        ...base,
        padding: "2px 8px",
        }),
        multiValue: (base) => ({
        ...base,
        display: "flex",
        alignItems: "center",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "13px",
        }),
        multiValueLabel: (base) => ({
        ...base,
        padding: "0",
        }),
        multiValueRemove: (base) => ({
        ...base,
        borderRadius: "50%",
        fontSize: "12px",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        marginLeft: "8px",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#f0f0f0",
        },
        }),
    };

    return (
        <Select
        value={value}
        onChange={onChange}
        options={platillosSeleccionados}
        isMulti
        styles={customStyles}
        />
    );
}
export default PlatillosSelect; 
