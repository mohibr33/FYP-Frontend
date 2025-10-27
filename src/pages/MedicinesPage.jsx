import React, { useState, useEffect } from 'react';
import { Search, Filter, Pill, AlertCircle, Plus, Trash2, Edit, X } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const MedicinesPage = ({ token, isAdmin }) => {
  const [medicines, setMedicines] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    usage: '',
    sideEffect: '',
    category: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedicines();
  }, [category, token]);

  const loadMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint;
      let headers = { 'Content-Type': 'application/json' };

      if (isAdmin && token) {
        endpoint = '/medicine';
        headers.Authorization = `Bearer ${token}`;
      } else {
        endpoint = category
          ? `/medicine/common?category=${encodeURIComponent(category)}`
          : '/medicine/common';
      }

      const response = await fetch(`${API_BASE}${endpoint}`, { headers });

      if (!response.ok) throw new Error(`Failed to load medicines: ${response.status}`);
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading medicines:', err);
      setError(err.message);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.usage || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        usage: formData.usage,
        sideEffect: formData.sideEffect.split(',').map(s => s.trim()).filter(Boolean),
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = editingMedicine
        ? `${API_BASE}/medicine/${editingMedicine._id}`
        : `${API_BASE}/medicine`;
      const method = editingMedicine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save medicine');
      }

      await loadMedicines();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving medicine:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      const response = await fetch(`${API_BASE}/medicine/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete medicine');
      await loadMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setError('Failed to delete medicine');
    }
  };

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      title: medicine.title || '',
      imageUrl: medicine.imageUrl || '',
      usage: medicine.usage || '',
      sideEffect: Array.isArray(medicine.sideEffect) ? medicine.sideEffect.join(', ') : '',
      category: medicine.category || '',
      tags: Array.isArray(medicine.tags) ? medicine.tags.join(', ') : ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      title: '',
      imageUrl: '',
      usage: '',
      sideEffect: '',
      category: '',
      tags: ''
    });
    setError('');
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Heart/BP', label: 'Heart/BP' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'First Aid & Wound Care', label: 'First Aid & Wound Care' },
    { value: 'Pain Relief', label: 'Pain Relief' },
    { value: 'Vitamins & Multivitamins', label: 'Vitamins & Multivitamins' },
    { value: 'Fever & Cough', label: 'Fever & Cough' },
    { value: 'Minerals & Supplements', label: 'Minerals & Supplements' },
    { value: 'Gastrointestinal', label: 'Gastrointestinal' },
  ];

  const filteredMedicines = medicines.filter(med =>
    (med.title && med.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (med.category && med.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      {/* Hero Section (Smaller Height) */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">Common Medicines</h1>
              <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
                Find detailed information about commonly used medicines — their purposes,
                dosage, and side effects.
              </p>
            </div>
            {isAdmin && token && (
              <button
                onClick={openAddModal}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Add Medicine
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                  category === cat.value
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading medicines...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center">
            <div className="inline-block bg-blue-100 rounded-full p-6 mb-4">
              <Pill className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Try selecting a different category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMedicines.map((med) => (
              <div
                key={med._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {med.imageUrl ? (
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-500 to-sky-600">
                    <img
                      src={med.imageUrl}
                      alt={med.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-4 left-4 px-4 py-1 bg-white/95 text-blue-700 rounded-full text-sm font-bold shadow-lg">
                      {med.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center relative">
                    <Pill className="w-20 h-20 text-white opacity-30" />
                    <span className="absolute top-4 left-4 px-4 py-1 bg-white/95 text-blue-700 rounded-full text-sm font-bold shadow-lg">
                      {med.category}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{med.title}</h3>
                    {isAdmin && token && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="font-bold text-gray-900 mb-1">Usage:</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{med.usage}</p>
                  </div>

                  {med.sideEffect && Array.isArray(med.sideEffect) && med.sideEffect.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Side Effects:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {med.sideEffect.map((effect, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {med.tags && Array.isArray(med.tags) && med.tags.length > 0 && (
                    <div className="mb-2">
                      <p className="font-bold text-gray-900 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {med.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;
