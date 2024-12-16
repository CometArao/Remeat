import Swal from 'sweetalert2';

export async function deleteDataAlert() {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  })
}

export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'success'
  );
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'error'
  );
};

export async function completeComandaAlert() {
  return Swal.fire({
    title: "¿Completar Comanda?",
    text: "Una vez completada, no se podrá eliminar ni modificar.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, completar",
    cancelButtonText: "Cancelar",
  });
};


export async function customConfirmAlert(title, text, confirmButtonText = "Confirmar", cancelButtonText = "Cancelar") {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  });
};

export const showInfoAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'info'
  );
};


