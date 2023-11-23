import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [recuperado, setRecuperado] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: { id: '', nombre: '' },
  });
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/producto');
        const data = await response.json();
        setProductos(data);
        setRecuperado(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categoria'); 
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleAgregar = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/producto/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nuevoProducto,
          categoria: nuevoProducto.categoria.id, 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProductos([...productos, data]);
        setNuevoProducto({
          nombre: '',
          precio: 0,
          stock: 0,
          categoria: { id: '', nombre: '' },
        });
        handleCloseModal();
      } else {
        console.error('Error adding product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/producto/${id}/eliminar`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProductos(productos.filter((prod) => prod.id !== id));
      } else {
        console.error('Error deleting product:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const mostrarTabla = () => (
    <div className="container mt-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.precio}</td>
              <td>{prod.stock}</td>
              <td>{prod.categoria}</td> 
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleEliminar(prod.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="success" onClick={handleShowModal}>
        Agregar Producto
      </Button>

      {/* Modal for adding new product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del producto"
                value={nuevoProducto.nombre}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                value={nuevoProducto.precio}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Stock"
                value={nuevoProducto.stock}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select" 
                value={nuevoProducto.categoria.id}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    categoria: {
                      id: e.target.value,
                      nombre: e.target.options[e.target.selectedIndex].text,
                    },
                  })
                }
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAgregar}>
            Agregar Producto
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  return (
    <div className="container">
      {recuperado ? (
        mostrarTabla()
      ) : (
        <div className="text-center mt-4">Recuperando datos...</div>
      )}
    </div>
  );
}

export default App;
