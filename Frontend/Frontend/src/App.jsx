import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit, Plus, X, Users, Package, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const TABS = {
  USERS: 'usuarios',
  PRODUCTS: 'productos',
};

const App = () => {
  const [activeTab, setActiveTab] = useState(TABS.USERS);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const isUsersTab = activeTab === TABS.USERS;
  const entityLabel = isUsersTab ? 'User' : 'Product';
  const endpoint = isUsersTab ? '/usuarios' : '/productos';

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (isUsersTab) setUsers(data);
        else setProducts(data);
      } catch (error) {
        if (error.name === 'AbortError') return;
        showNotification(`Failed to load ${isUsersTab ? 'users' : 'products'}`, 'error');
      } finally {
        setLoading(false);
      }
    },
    [endpoint, isUsersTab, showNotification]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const id = editingItem?.id ?? editingItem?._id;
    const url = editingItem
      ? `${API_BASE_URL}${endpoint}/${id}`
      : `${API_BASE_URL}${endpoint}`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(`${entityLabel} ${editingItem ? 'updated' : 'created'} successfully`);
        closeModal();
        fetchData();
      } else {
        const errorBody = await response.text().catch(() => '');
        showNotification(errorBody || 'Failed to save', 'error');
      }
    } catch (error) {
      showNotification('Connection error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('Deleted successfully');
        fetchData();
      } else {
        showNotification('Failed to delete', 'error');
      }
    } catch (error) {
      showNotification('Connection error', 'error');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(
        isUsersTab
          ? { nombre: item.nombre, email: item.email, telefono: item.telefono || '' }
          : { nombre: item.nombre, precio: item.precio }
      );
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

  const items = isUsersTab ? users : products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Microservices System</h1>
          <p className="text-purple-200">User and Product Management</p>
        </div>

        <div className="flex justify-center gap-4 mb-8" role="tablist">
          <button
            role="tab"
            aria-selected={isUsersTab}
            onClick={() => setActiveTab(TABS.USERS)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isUsersTab
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users size={20} />
            Users
          </button>
          <button
            role="tab"
            aria-selected={!isUsersTab}
            onClick={() => setActiveTab(TABS.PRODUCTS)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              !isUsersTab
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Package size={20} />
            Products
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{isUsersTab ? 'Users' : 'Products'}</h2>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add {entityLabel}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
              <p className="text-white mt-4">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    {isUsersTab ? (
                      <>
                        <th className="text-left py-3 px-4 text-purple-200">Name</th>
                        <th className="text-left py-3 px-4 text-purple-200">Email</th>
                        <th className="text-left py-3 px-4 text-purple-200">Phone</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-3 px-4 text-purple-200">Name</th>
                        <th className="text-left py-3 px-4 text-purple-200">Price</th>
                      </>
                    )}
                    <th className="text-right py-3 px-4 text-purple-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const id = item.id ?? item._id;
                    return (
                      <tr key={id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        {isUsersTab ? (
                          <>
                            <td className="py-3 px-4 text-white">{item.nombre}</td>
                            <td className="py-3 px-4 text-white">{item.email}</td>
                            <td className="py-3 px-4 text-white">{item.telefono || 'N/A'}</td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4 text-white">{item.nombre}</td>
                            <td className="py-3 px-4 text-white">
                              ${Number(item.precio ?? 0).toFixed(2)}
                            </td>
                          </>
                        )}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => openModal(item)}
                            aria-label={`Edit ${entityLabel.toLowerCase()}`}
                            className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            aria-label={`Delete ${entityLabel.toLowerCase()}`}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="text-center py-12 text-purple-200">
                  No {isUsersTab ? 'users' : 'products'} registered
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit' : 'Add'} {entityLabel}
              </h3>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {isUsersTab ? (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2" htmlFor="user-name">Name</label>
                    <input
                      id="user-name"
                      type="text"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2" htmlFor="user-email">Email</label>
                    <input
                      id="user-email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-purple-200 mb-2" htmlFor="user-phone">Phone</label>
                    <input
                      id="user-phone"
                      type="tel"
                      value={formData.telefono || ''}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-200 mb-2" htmlFor="product-name">Product Name</label>
                    <input
                      id="product-name"
                      type="text"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-purple-200 mb-2" htmlFor="product-price">Price</label>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio ?? ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFormData({ ...formData, precio: v === '' ? '' : parseFloat(v) });
                      }}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
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
