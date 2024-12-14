import { deleteHorarioLaboral } from '@services/horarios.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteHorarioLaboral = (fetchHorariosLaborales, setDataHorarioLaboral) => {
    const handleDelete = async (selectedHorariosLaborales) => {
        if (selectedHorariosLaborales.length > 0) {
            try {
                const result = await deleteDataAlert(); // Confirmación del usuario
                if (result.isConfirmed) {
                    const id = selectedHorariosLaborales[0]?.id_horario_laboral; // Obtener el ID del seleccionado
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    const response = await deleteHorarioLaboral(id); // Llama al servicio de eliminación

                    if (response?.status === 'Client error') {
                        throw new Error(response.details || 'Error desconocido al eliminar el horario laboral.');
                    }

                    showSuccessAlert('¡Eliminado!', 'El horario laboral ha sido eliminado correctamente.');
                    await fetchHorariosLaborales(); // Refresca los datos
                    setDataHorarioLaboral([]); // Limpia la selección
                }
            } catch (error) {
                console.error('Error al eliminar el horario laboral:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el horario laboral.');
            }
        } else {
            showErrorAlert('Error', 'No se seleccionó ningún horario laboral para eliminar.');
        }
    };

    return { handleDelete };
};

export default useDeleteHorarioLaboral;
