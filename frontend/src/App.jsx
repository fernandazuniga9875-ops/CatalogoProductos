import { useEffect, useState } from 'react';
import ProductoForm from './components/productoForm';
import ProductoItem from './components/productoItem';
import './App.css';

const API_URL = 'http://localhost:3000/api/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);

  // GET - Cargar productos
  const cargarProductos = async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data);
      setMensaje(null);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al conectar con el servidor',
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // POST - Agregar producto
  const agregarProducto = async (producto) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje({
          tipo: 'error',
          texto: data.mensaje || 'Datos incorrectos',
        });
        return;
      }
      setProductos([...productos, data]);
      setMensaje({ tipo: 'ok', texto: 'Producto agregado correctamente.' });
      setMostrarForm(false);
    } catch {
      setMensaje({
        tipo: 'error',
        texto: 'Error al conectar con el servidor',
      });
    }
  };

  // PUT - Editar producto
  const actualizarProducto = async (id, producto) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje({
          tipo: 'error',
          texto: data.mensaje || 'Datos incorrectos',
        });
        return;
      }
      setProductos(productos.map((p) => (p.id === id ? data : p)));
      setMensaje({ tipo: 'ok', texto: 'Producto actualizado correctamente.' });
      setProductoEditar(null);
      setMostrarForm(false);
    } catch {
      setMensaje({
        tipo: 'error',
        texto: 'Error al conectar con el servidor',
      });
    }
  };

  // DELETE - Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setMensaje({
          tipo: 'error',
          texto: data.mensaje || 'No se encontró el producto',
        });
        return;
      }
      setProductos(productos.filter((p) => p.id !== id));
      setMensaje({ tipo: 'ok', texto: 'Producto eliminado correctamente.' });
    } catch {
      setMensaje({
        tipo: 'error',
        texto: 'Error al conectar con el servidor',
      });
    }
  };

  // Filtros
  const categorias = [
    'Todos',
    ...new Set(productos.map((p) => p.categoria)),
  ];

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="container">
      <h1>🛒 CATÁLOGO DE PRODUCTOS</h1>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          className="btn-agregar"
          onClick={() => {
            setProductoEditar(null);
            setMostrarForm(!mostrarForm);
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {mostrarForm && (
        <ProductoForm
          productoEditar={productoEditar}
          onGuardar={(prod) => {
            if (productoEditar) {
              actualizarProducto(productoEditar.id, prod);
            } else {
              agregarProducto(prod);
            }
          }}
          onCancelar={() => {
            setMostrarForm(false);
            setProductoEditar(null);
          }}
        />
      )}

      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <div className="lista-productos">
          {productosFiltrados.map((p) => (
            <ProductoItem
              key={p.id}
              producto={p}
              onEditar={() => {
                setProductoEditar(p);
                setMostrarForm(true);
              }}
              onEliminar={() => eliminarProducto(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;