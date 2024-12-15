import axios from './root.service.js';

export async function getHorariosLaborales() {
    try {
        const { data } = await axios.get('/horarios-laborales/');
        return data.data; // Asegúrate de que el backend devuelva `data` correctamente
    } catch (error) {
        console.error('Error fetching horarios laborales:', error);
        return error.response?.data || [];
    }
}

export async function getHorarioLaboralById(id) {
    try {
        const { data } = await axios.get(`/horarios-laborales/${id}`);
        return data.data; // Devuelve solo los datos relevantes
    } catch (error) {
        console.error(`Error fetching horario laboral con ID ${id}:`, error);
        throw error.response?.data || error.message;
    }
}

export async function createHorarioLaboral(horarioLaboral) {
    try {
      const { data } = await axios.post('/horarios-laborales', horarioLaboral);
      return data;
    } catch (error) {
      console.error('Error creando horario laboral:', error);
      throw error.response?.data || 'Error interno al crear el horario laboral.';
    }
  }

export async function updateHorarioLaboral(id, horarioLaboral) {
    try {
        const { data } = await axios.patch(`/horarios-laborales/${id}`, horarioLaboral);
        return data;
    } catch (error) {
        console.error("Error actualizando horario laboral:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}

export async function deleteHorarioLaboral(id) {
    try {
        if (!id) throw new Error('ID no válido para eliminar el horario laboral.');

        const { data } = await axios.delete(`/horarios-laborales/${id}`);
        return data;
    } catch (error) {
        console.error('Error eliminando horario laboral:', error);
        return error.response?.data || { status: 'Error', details: error.message };
    }
}
