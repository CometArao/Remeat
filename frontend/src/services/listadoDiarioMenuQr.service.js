import axios from './root.service';


export const generateMenuQRCode = async () => {
    const response = await axios.get('/menus/menu/qr', {
      withCredentials: true, // Asegurar que las cookies se incluyan en la solicitud
    });
    return response.data;
  };


export const fetchListadoDiarioMenuQr = async (id_menu) => {
    try {
        const response = await axios.get(`menus/${id_menu}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching menu by id:", error);
        throw new Error("No se pudo obtener el menú del día");
    }
};

