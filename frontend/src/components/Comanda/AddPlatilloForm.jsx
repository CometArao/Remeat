import useAddPlatilloToComanda from '../../hooks/Comandas/useAddPlatilloToComanda';

const AddPlatilloForm = ({ comandaId }) => {
  const { addPlatillo, loading } = useAddPlatilloToComanda();
  const [platilloData, setPlatilloData] = useState({
    id_platillo: '',
    cantidad: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPlatillo(comandaId, platilloData, 'YOUR_TOKEN');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>ID Platillo:</label>
      <input
        type="number"
        name="id_platillo"
        value={platilloData.id_platillo}
        onChange={(e) => setPlatilloData({ ...platilloData, id_platillo: e.target.value })}
        required
      />
      <label>Cantidad:</label>
      <input
        type="number"
        name="cantidad"
        value={platilloData.cantidad}
        onChange={(e) => setPlatilloData({ ...platilloData, cantidad: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir Platillo'}
      </button>
    </form>
  );
};
