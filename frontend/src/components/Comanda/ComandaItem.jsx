import React from 'react';

const ComandaItem = ({ comanda }) => {
  return (
    <li>
      <h3>Comanda ID: {comanda.id_comanda}</h3>
      <p>Fecha de Compra: {comanda.fecha_compra_comanda}</p>
      <p>Hora de Compra: {comanda.hora_compra_comanda}</p>
      <p>Estado: {comanda.estado_comanda}</p>
      <h4>Información del Usuario:</h4>
      <p>Nombre: {comanda.usuario.nombre_usuario} {comanda.usuario.apellido_usuario}</p>
      <p>Correo: {comanda.usuario.correo_usuario}</p>
      <p>Rol: {comanda.usuario.rol_usuario}</p>
    </li>
  );
};

export default ComandaItem;
