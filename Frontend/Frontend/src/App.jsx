import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Users, Package, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const App = () => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsuarios();
    } else {
      fetchProductos();
    }
  }, [activeTab]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      showNotification('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      showNotification('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = activeTab === 'usuarios' ? '/usuarios' : '/productos';
    const url = editingItem
      ? `${API_BASE_URL}${endpoint}/${editingItem.id || editingItem._id}`
      : `${API_BASE_URL}${endpoint}`;

    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(
          `${activeTab === 'usuarios' ? 'Usuario' : 'Producto'} ${
            editingItem ? 'actualizado' : 'creado'
          } exitosamente`
        );
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        activeTab === 'usuarios' ? fetchUsuarios() : fetchProductos();
      } else {
        showNotification('Error al guardar', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;

    setLoading(true);
    const endpoint = activeTab === 'usuarios' ? '/usuarios' : '/productos';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('Eliminado exitosamente');
        activeTab === 'usuarios' ? fetchUsuarios() : fetchProductos();
      } else {
        showNotification('Error al eliminar', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'usuarios') {
        setFormData({
          nombre: item.nombre,
          email: item.email,
          telefono: item.telefono || '',
        });
      } else {
        setFormData({
          nombre: item.nombre,
          precio: item.precio,
        });
      }
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema de Microservicios
          </h1>
          <p className="text-purple-200">
            Gestión de Usuarios y Productos
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'usuarios'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users size={20} />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'productos'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Package size={20} />
            Productos
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'usuarios' ? 'Usuarios' : 'Productos'}
            </h2>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Agregar {activeTab === 'usuarios' ? 'Usuario' : 'Producto'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-white mt-4">Cargando...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    {activeTab === 'usuarios' ? (
                      <>
                        <th className="text-left py-3 px-4 text-purple-200">Nombre</th>
                        <th className="text-left py-3 px-4 text-purple-200">Email</th>
                        <th className="text-left py-3 px-4 text-purple-200">Teléfono</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-3 px-4 text-purple-200">Nombre</th>
                        <th className="text-left py-3 px-4 text-purple-200">Precio</th>
                      </>
                    )}
                    <th className="text-right py-3 px-4 text-purple-200">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'usuarios' ? usuarios : productos).map((item) => (
                    <tr
                      key={item.id || item._id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      {activeTab === 'usuarios' ? (
                        <>
                          <td className="py-3 px-4 text-white">{item.nombre}</td>
                          <td className="py-3 px-4 text-white">{item.email}</td>
                          <td className="py-3 px-4 text-white">{item.telefono || 'N/A'}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-white">{item.nombre}</td>
                          <td className="py-3 px-4 text-white">
                            ${item.precio.toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openModal(item)}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id || item._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(activeTab === 'usuarios' ? usuarios : productos).length === 0 && (
                <div className="text-center py-12 text-purple-200">
                  No hay {activeTab} registrados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Editar' : 'Agregar'}{' '}
                {activeTab === 'usuarios' ? 'Usuario' : 'Producto'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'usuarios' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-purple-200 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={formData.telefono || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2">Nombre del Producto</label>
                    <input
                      type="text"
                      value={formData.nombre || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-purple-200 mb-2">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;