import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SECTIONS } from '../constants/permissions';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Trips = () => {
  const { hasPermissionSync } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    members: []
  });

  const canEdit = hasPermissionSync(SECTIONS.TRIPS, "edit");
  const canAdd = hasPermissionSync(SECTIONS.TRIPS, "edit");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firestore query
      const mockTrips = [
        { 
          id: 1, 
          name: 'رحلة العمرة الشتوية', 
          description: 'رحلة عمرة لمدة أسبوع',
          date: '2024-01-15',
          members: ['أحمد محمد', 'فاطمة علي', 'محمد أحمد'],
          busId: 1,
          driverId: 1,
          createdAt: new Date() 
        },
        { 
          id: 2, 
          name: 'رحلة الحج السنوية', 
          description: 'رحلة حج لمدة شهر',
          date: '2024-07-01',
          members: ['علي حسن', 'خديجة محمد'],
          busId: 2,
          driverId: 2,
          createdAt: new Date() 
        }
      ];
      setTrips(mockTrips);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم الرحلة');
      return;
    }

    if (!formData.date) {
      toast.error('يرجى إدخال تاريخ الرحلة');
      return;
    }

    try {
      if (editingTrip) {
        // Update existing trip
        const updatedTrips = trips.map(trip =>
          trip.id === editingTrip.id
            ? { ...trip, ...formData, updatedAt: new Date() }
            : trip
        );
        setTrips(updatedTrips);
        toast.success('تم تحديث الرحلة بنجاح');
      } else {
        // Add new trip
        const newTrip = {
          id: Date.now(),
          ...formData,
          createdAt: new Date()
        };
        setTrips([...trips, newTrip]);
        toast.success('تم إضافة الرحلة بنجاح');
      }
      
      setShowForm(false);
      setEditingTrip(null);
      setFormData({ name: '', description: '', date: '', members: [] });
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      description: trip.description,
      date: trip.date,
      members: trip.members || []
    });
    setShowForm(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;
    
    try {
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast.success('تم حذف الرحلة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الرحلة');
    }
  };

  const addMember = () => {
    const memberName = prompt('أدخل اسم العضو:');
    if (memberName && memberName.trim()) {
      if (formData.members.length >= 50) {
        toast.error('لا يمكن إضافة أكثر من 50 عضو');
        return;
      }
      setFormData({
        ...formData,
        members: [...formData.members, memberName.trim()]
      });
    }
  };

  const removeMember = (index) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index)
    });
  };

  const exportToExcel = (trip) => {
    // TODO: Implement actual Excel export
    const data = [
      ['اسم الرحلة', trip.name],
      ['الوصف', trip.description],
      ['التاريخ', trip.date],
      [''],
      ['قائمة الأعضاء:'],
      ...trip.members.map(member => [member])
    ];
    
    // Create CSV content
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${trip.name}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('تم تصدير البيانات بنجاح');
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', date: '', members: [] });
    setEditingTrip(null);
    setShowForm(false);
  };

  return (
    <ProtectedRoute requiredSection={SECTIONS.TRIPS} requiredPermission="view">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الرحلات</h1>
              <p className="text-gray-600">إضافة وتعديل وحذف رحلات الحج والعمرة</p>
            </div>
            {canAdd && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                إضافة رحلة جديدة
              </button>
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingTrip ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم الرحلة *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل اسم الرحلة"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الرحلة *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وصف الرحلة
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل وصف الرحلة"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        قائمة الأعضاء ({formData.members.length}/50)
                      </label>
                      <button
                        type="button"
                        onClick={addMember}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + إضافة عضو
                      </button>
                    </div>
                    <div className="border border-gray-300 rounded-md p-3 min-h-[100px]">
                      {formData.members.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">لا توجد أعضاء مضافين</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.members.map((member, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span>{member}</span>
                              <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                      {editingTrip ? 'تحديث' : 'إضافة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Trips List */}
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
                        اسم الرحلة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عدد الأعضاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trip.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {trip.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trip.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trip.members?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => exportToExcel(trip)}
                              className="text-green-600 hover:text-green-900"
                              title="تصدير إلى Excel"
                            >
                              📊
                            </button>
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => handleEdit(trip)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDelete(trip.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  حذف
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {trips.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد رحلات مسجلة</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Trips; 