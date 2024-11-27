
import useGetIngrediente from '../hooks/ingredientes/useGetIngredientes';
import useCreateIngrediente from '../hooks/ingredientes/useCreateIngredientes';
import Table from '@components/Table';
import CreateIngredientePopup from '@components/PopupIngrediente';

const Ingredientes = () => {
  const { ingredientes, setIngredientes } = useGetIngrediente(); // Para obtener y actualizar la lista de ingredientes.
  const {
    handleCreate,
    isCreatePopupOpen,
    setIsCreatePopupOpen,
  } = useCreateIngrediente(setIngredientes); // Para manejar el popup de creación.

  return (
    <div className="main-container">
      <h1>Gestión de Ingredientes</h1>

      {/* Botón para abrir el popup de creación */}
      <button onClick={() => setIsCreatePopupOpen(true)} className="create-button">
        Crear Ingrediente
      </button>

      {/* Tabla de ingredientes */}
      <Table
        data={ingredientes}
        columns={[
          { title: 'Nombre del Ingrediente', field: 'nombre_ingrediente' },
          { title: 'Cantidad Disponible', field: 'cantidad_ingrediente' },
        ]}
        onRowClick={(ingrediente) => {
          console.log('Ingrediente seleccionado:', ingrediente);
        }}
      />

      {/* Popup para crear ingrediente */}
      <CreateIngredientePopup
        show={isCreatePopupOpen}
        setShow={setIsCreatePopupOpen}
        title="Crear Ingrediente"
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Ingredientes;
