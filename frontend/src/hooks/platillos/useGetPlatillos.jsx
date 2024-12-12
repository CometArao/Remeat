import { useState, useEffect } from "react";
import { getPlatillos } from "@services/platillos.service.js";

const useGetPlatillos = () => {
  const [platillo, setPlatillo] = useState([]);
  console.log("Estado platillo:", platillo);

  const fetchPlatillo = async () => {
    try {
      const data = await getPlatillos();

      // Validar los platillos según el precio y la disponibilidad de ingredientes
      const platillosFiltrados = data.map((platillo) => ({
        ...platillo,
        precioEstablecido: platillo.precio_platillo > 0,
        ingredientesDisponibles: platillo.ingredientes.every(
          (ing) => ing.cantidadDisponible >= ing.porcion_ingrediente_platillo
        ),
      }));

      setPlatillo(platillosFiltrados);
    } catch (error) {
      console.error("Error fetching platillos:", error);
    }
  };

  useEffect(() => {
    fetchPlatillo();
  }, []);

  return { platillo, fetchPlatillo, setPlatillo };
};

export default useGetPlatillos;
