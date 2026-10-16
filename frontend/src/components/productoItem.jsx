function ProductoItem({ producto, onEditar, onEliminar }) {
  return (
    <div className="card">
      <h3>{producto.nombre}</h3>
      <p>
        <strong>Categoría:</strong> {producto.categoria}
      </p>
      <p>
        <strong>Precio:</strong> ${producto.precio.toLocaleString()}
      </p>
      <p>
        <strong>Stock:</strong> {producto.stock}
      </p>
      {producto.descripcion && (
        <p className="desc">{producto.descripcion}</p>
      )}
      <div className="acciones">
        <button className="btn-editar" onClick={onEditar}>
          Editar
        </button>
        <button className="btn-eliminar" onClick={onEliminar}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ProductoItem;