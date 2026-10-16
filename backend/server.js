const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ============================
// Catálogo de productos (12)
// ============================
let productos = [
  {
    id: 1,
    nombre: 'Laptop Lenovo',
    categoria: 'Computadoras',
    precio: 12500,
    stock: 10,
    descripcion: 'Laptop para trabajo y estudio',
  },
  {
    id: 2,
    nombre: 'MacBook Air M2',
    categoria: 'Computadoras',
    precio: 24999,
    stock: 5,
    descripcion: 'Laptop ultraligera Apple',
  },
  {
    id: 3,
    nombre: 'iPhone 15',
    categoria: 'Celulares',
    precio: 18999,
    stock: 8,
    descripcion: 'Smartphone Apple 128GB',
  },
  {
    id: 4,
    nombre: 'Samsung Galaxy S24',
    categoria: 'Celulares',
    precio: 17500,
    stock: 12,
    descripcion: 'Smartphone Android gama alta',
  },
  {
    id: 5,
    nombre: 'Mouse Logitech G502',
    categoria: 'Periféricos',
    precio: 1200,
    stock: 25,
    descripcion: 'Mouse gamer inalámbrico',
  },
  {
    id: 6,
    nombre: 'Teclado Mecánico Redragon',
    categoria: 'Periféricos',
    precio: 850,
    stock: 15,
    descripcion: 'Teclado mecánico USB RGB',
  },
  {
    id: 7,
    nombre: 'Monitor LG 24"',
    categoria: 'Periféricos',
    precio: 3200,
    stock: 7,
    descripcion: 'Monitor Full HD 75Hz',
  },
  {
    id: 8,
    nombre: 'Audífonos Sony WH-1000XM5',
    categoria: 'Audio',
    precio: 6500,
    stock: 6,
    descripcion: 'Audífonos con cancelación de ruido',
  },
  {
    id: 9,
    nombre: 'Bocina JBL Flip 6',
    categoria: 'Audio',
    precio: 2200,
    stock: 14,
    descripcion: 'Bocina Bluetooth portátil',
  },
  {
    id: 10,
    nombre: 'Memoria RAM Kingston 16GB',
    categoria: 'Componentes',
    precio: 1400,
    stock: 20,
    descripcion: 'RAM DDR4 3200MHz',
  },
  {
    id: 11,
    nombre: 'SSD Samsung 1TB',
    categoria: 'Componentes',
    precio: 2100,
    stock: 18,
    descripcion: 'Unidad de estado sólido NVMe',
  },
  {
    id: 12,
    nombre: 'Funda para Laptop 15"',
    categoria: 'Accesorios',
    precio: 450,
    stock: 30,
    descripcion: 'Funda impermeable para laptop',
  },
];

let nextId = 13;

// ============================
// Validaciones
// ============================
function validarProducto(body) {
  const errores = [];
  if (!body.nombre || body.nombre.trim() === '') {
    errores.push('El nombre es obligatorio.');
  }
  if (!body.categoria || body.categoria.trim() === '') {
    errores.push('La categoría es obligatoria.');
  }
  if (
    body.precio === undefined ||
    body.precio === null ||
    Number(body.precio) <= 0
  ) {
    errores.push('El precio debe ser mayor que 0.');
  }
  if (
    body.stock === undefined ||
    body.stock === null ||
    Number(body.stock) < 0
  ) {
    errores.push('El stock debe ser igual o mayor que 0.');
  }
  return errores;
}

// ============================
// ENDPOINTS
// ============================

// GET /api/productos
app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

// GET /api/productos/:id
app.get('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  res.status(200).json(producto);
});

// POST /api/productos
app.post('/api/productos', (req, res) => {
  const errores = validarProducto(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Datos incorrectos', errores });
  }

  const nuevoProducto = {
    id: nextId++,
    nombre: req.body.nombre.trim(),
    categoria: req.body.categoria.trim(),
    precio: Number(req.body.precio),
    stock: Number(req.body.stock),
    descripcion: req.body.descripcion || '',
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT /api/productos/:id
app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  const errores = validarProducto(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Datos incorrectos', errores });
  }

  productos[index] = {
    id,
    nombre: req.body.nombre.trim(),
    categoria: req.body.categoria.trim(),
    precio: Number(req.body.precio),
    stock: Number(req.body.stock),
    descripcion: req.body.descripcion || '',
  };

  res.status(200).json(productos[index]);
});

// DELETE /api/productos/:id
app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  const eliminado = productos.splice(index, 1)[0];
  res.status(200).json({ mensaje: 'Producto eliminado', producto: eliminado });
});

// Middleware de error 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Express escuchando en http://localhost:${PORT}`);
});