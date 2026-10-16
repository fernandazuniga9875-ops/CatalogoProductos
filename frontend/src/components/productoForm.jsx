import { useState, useEffect } from 'react';

const VACIO = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  descripcion: '',
};

function ProductoForm({ productoEditar, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    if (productoEditar) {
      setForm({
        nombre: productoEditar.nombre,
        categoria: productoEditar.categoria,
        precio: productoEditar.precio,
        stock: productoEditar.stock,
        descripcion: productoEditar.descripcion || '',
      });
    } else {
      setForm(VACIO);
    }
  }, [productoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      nombre: form.nombre,
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      descripcion: form.descripcion,
    });
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>{productoEditar ? 'Editar producto' : 'Nuevo producto'}</h2>

      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="categoria"
        placeholder="Categoría"
        value={form.categoria}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
        min="1"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        min="0"
        required
      />
      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
      />

      <div className="acciones">
        <button type="submit" className="btn-guardar">
          Guardar producto
        </button>
        <button
          type="button"
          className="btn-cancelar"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;