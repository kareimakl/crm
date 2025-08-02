import React, { useState, useMemo, useEffect } from 'react';
import SupplyCard from '../components/SupplyCard';
import SupplyFormModal from '../components/SupplyFormModal';
import FilterSortBar from '../components/FilterSortBar';
import DynamicForm from '../components/DynamicForm';
import ResponsiveTable from '../components/ResponsiveTable';
import { ServiceCategoryService } from '../services/serviceCategoryService';

const initialSupplies = [
  {
    id: 1,
    name: 'تذاكر طيران',
    type: 'طيران',
    price: 1500,
    quantity: 50,
    date: '2024-05-15',
    supplier: 'شركة الطيران',
    extra_fields: { 'مدة الصلاحية': 'سنة', 'مكان التخزين': 'المخزن الرئيسي' }
  },
];

const DEFAULT_TYPES = [
  'مستلزمات عمرة',
  'طيران',
  'الحج',
  'فندق',
  'باص',
];

export default function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [types, setTypes] = useState(DEFAULT_TYPES);
  const [showAddType, setShowAddType] = useState(false);
  const [newType, setNewType] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://localhost:4000/api/supplies');
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      setSupplies(data);
    }
    fetchData();
  }, []);

  // Subscribe to Firestore categories
  useEffect(() => {
    ServiceCategoryService.ensureDefaultCategories();
    const unsub = ServiceCategoryService.subscribe(setCategories);
    return () => unsub();
  }, []);

  // Collect all unique types (including custom)
  const allTypes = useMemo(() => {
    const set = new Set(types);
    supplies.forEach(s => set.add(s.type));
    return Array.from(set);
  }, [types, supplies]);

  // Filter and sort supplies
  const filteredSupplies = useMemo(() => {
    let list = [...supplies];
    if (filterType) list = list.filter(s => s.type === filterType);
    switch (sortBy) {
      case 'date_desc':
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'quantity_desc':
        list.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'quantity_asc':
        list.sort((a, b) => a.quantity - b.quantity);
        break;
      default:
        break;
    }
    return list;
  }, [supplies, filterType, sortBy]);

  // Add new supply
  const handleAddSupply = async (data) => {
    await fetch('http://localhost:4000/api/supplies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        price: data.price,
        quantity: data.quantity,
        date: data.date,
        supplier: data.supplier,
        notes: '', // add extra fields if needed
      })
    });
    // Refresh supplies from backend
    const res = await fetch('http://localhost:4000/api/supplies');
    let newData = await res.json();
    if (!Array.isArray(newData)) newData = [];
    setSupplies(newData);
    // If new type was used, add it to types
    if (data.type && !types.includes(data.type)) {
      setTypes(prev => [...prev, data.type]);
    }
    setShowModal(false);
  };

  // Edit, Delete handlers
  const handleEdit = (id, updated) => {
    setSupplies(supplies.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };
  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/api/supplies/${id}`, { method: 'DELETE' });
    // Refresh supplies from backend
    const res = await fetch('http://localhost:4000/api/supplies');
    let newData = await res.json();
    if (!Array.isArray(newData)) newData = [];
    setSupplies(newData);
  };

  // Add new category
  const handleAddCategory = async () => {
    if (newType && !categories.some(c => c.name === newType)) {
      await ServiceCategoryService.add(newType);
      setNewType('');
      setShowAddType(false);
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (editingCategory && editCategoryName) {
      await ServiceCategoryService.update(editingCategory.id, { name: editCategoryName });
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    await ServiceCategoryService.remove(id);
  };

  return (
    <div className="p-4 rtl bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">قائمة التوريدات</h1>
          <button
            className="btn-primary rounded-2xl px-6 py-2 text-lg"
            onClick={() => setShowModal(true)}
          >
            إضافة فاتورة
          </button>
        </div>
        <FilterSortBar
          types={categories.map(cat => cat.name)}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-1">
              <button
                className={`px-4 py-2 rounded-lg shadow text-sm font-bold transition border ${filterType === cat.name ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                onClick={() => setFilterType(cat.name === filterType ? '' : cat.name)}
              >
                {cat.name}
              </button>
              <button
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                onClick={() => { setEditingCategory(cat); setEditCategoryName(cat.name); }}
                title="تعديل"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414a1 1 0 01-1.263-1.263l1.414-4.243a4 4 0 01.828-1.414z"/></svg>
              </button>
              <button
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                onClick={() => handleDeleteCategory(cat.id)}
                title="حذف"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))}
          <button
            className="px-4 py-2 rounded-lg shadow text-sm font-bold bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
            onClick={() => setShowAddType(true)}
          >
            + إضافة خدمة
          </button>
        </div>
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rtl">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">تعديل اسم الخدمة</h2>
                <button className="text-gray-400 hover:text-gray-700" onClick={() => setEditingCategory(null)}>✕</button>
              </div>
              <input
                className="input-field w-full mb-4"
                placeholder="اسم الخدمة"
                value={editCategoryName}
                onChange={e => setEditCategoryName(e.target.value)}
              />
              <button className="btn-primary w-full" onClick={handleEditCategory}>حفظ</button>
            </div>
          </div>
        )}
        {showAddType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rtl">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">إضافة نوع خدمة جديد</h2>
                <button className="text-gray-400 hover:text-gray-700" onClick={() => setShowAddType(false)}>✕</button>
              </div>
              <input
                className="input-field w-full mb-4"
                placeholder="اسم الخدمة الجديدة"
                value={newType}
                onChange={e => setNewType(e.target.value)}
              />
              <button className="btn-success w-full" onClick={handleAddCategory}>إضافة</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredSupplies.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">لا توجد توريدات</div>
          ) : (
            filteredSupplies.map(supply => (
              <SupplyCard
                key={supply.id}
                supply={supply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      <SupplyFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddSupply}
        existingTypes={allTypes}
      />
    </div>
  );
} 