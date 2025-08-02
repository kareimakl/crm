import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SECTIONS } from '../constants/permissions';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Warehouses = () => {
  const { hasPermissionSync } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const canEdit = hasPermissionSync(SECTIONS.WAREHOUSES, "edit");
  const canAdd = hasPermissionSync(SECTIONS.WAREHOUSES, "edit");

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firestore query
      const mockWarehouses = [
        { id: 1, name: 'مخزن الرياض الرئيسي', address: 'الرياض، المملكة العربية السعودية', createdAt: new Date() },
        { id: 2, name: 'مخزن جدة', address: 'جدة، المملكة العربية السعودية', createdAt: new Date() },
        { id: 3, name: 'مخزن الدمام', address: 'الدمام، المملكة العربية السعودية', createdAt: new Date() }
      ];
      setWarehouses(mockWarehouses);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم المخزن');
      return;
    }

    try {
      if (editingWarehouse) {
        // Update existing warehouse
        const updatedWarehouses = warehouses.map(warehouse =>
          warehouse.id === editingWarehouse.id
            ? { ...warehouse, ...formData, updatedAt: new Date() }
            : warehouse
        );
        setWarehouses(updatedWarehouses);
        toast.success('تم تحديث المخزن بنجاح');
      } else {
        // Add new warehouse
        const newWarehouse = {
          id: Date.now(),
          ...formData,
          createdAt: new Date()
        };
        setWarehouses([...warehouses, newWarehouse]);
        toast.success('تم إضافة المخزن بنجاح');
      }
      
      setShowForm(false);
      setEditingWarehouse(null);
      setFormData({ name: '', address: '' });
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      address: warehouse.address
    });
    setShowForm(true);
  };

  const handleDelete = async (warehouseId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المخزن؟')) return;
    
    try {
      setWarehouses(warehouses.filter(warehouse => warehouse.id !== warehouseId));
      toast.success('تم حذف المخزن بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف المخزن');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', address: '' });
    setEditingWarehouse(null);
    setShowForm(false);
  };

  return (
    <ProtectedRoute requiredSection={SECTIONS.WAREHOUSES} requiredPermission="view">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة المخازن</h1>
              <p className="text-gray-600">إضافة وتعديل وحذف مخازن الشركة</p>
            </div>
            {canAdd && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                إضافة مخزن جديد
              </button>
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editingWarehouse ? 'تعديل المخزن' : 'إضافة مخزن جديد'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المخزن *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسم المخزن"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل عنوان المخزن"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 space-x-reverse">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingWarehouse ? 'تحديث' : 'إضافة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Warehouses List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">جاري التحميل...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        اسم المخزن
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        العنوان
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      {canEdit && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الإجراءات
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {warehouses.map((warehouse) => (
                      <tr key={warehouse.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {warehouse.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {warehouse.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {warehouse.createdAt.toLocaleDateString('ar-SA')}
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleEdit(warehouse)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDelete(warehouse.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {warehouses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد مخازن مسجلة</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Warehouses; 