import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RoleService } from '../services/roleService';
import { SECTIONS, PERMISSIONS } from '../constants/permissions';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const RoleManagement = () => {
  const { hasPermissionSync } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    roleName: '',
    displayName: '',
    permissions: {}
  });

  const canManageRoles = hasPermissionSync(SECTIONS.SETTINGS, "admin");

  useEffect(() => {
    if (canManageRoles) {
      loadRoles();
    }
  }, [canManageRoles]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await RoleService.getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الأدوار');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.roleName.trim()) {
      toast.error('يرجى إدخال اسم الدور');
      return;
    }

    if (!formData.displayName.trim()) {
      toast.error('يرجى إدخال الاسم المعروض');
      return;
    }

    try {
      if (editingRole) {
        await RoleService.updateRole(formData.roleName, formData);
        toast.success('تم تحديث الدور بنجاح');
      } else {
        await RoleService.createRole(formData);
        toast.success('تم إنشاء الدور بنجاح');
      }
      
      setShowForm(false);
      setEditingRole(null);
      setFormData({
        roleName: '',
        displayName: '',
        permissions: RoleService.createDefaultRolePermissions()
      });
      loadRoles();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      displayName: role.displayName,
      permissions: { ...role.permissions }
    });
    setShowForm(true);
  };

  const handleDelete = async (roleName) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدور؟')) return;
    
    try {
      await RoleService.deleteRole(roleName);
      toast.success('تم حذف الدور بنجاح');
      loadRoles();
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء حذف الدور');
    }
  };

  const updatePermission = (section, permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [section]: permission
      }
    });
  };

  const resetForm = () => {
    setFormData({
      roleName: '',
      displayName: '',
      permissions: RoleService.createDefaultRolePermissions()
    });
    setEditingRole(null);
    setShowForm(false);
  };

  if (!canManageRoles) {
    return (
      <ProtectedRoute requiredSection={SECTIONS.SETTINGS} requiredPermission="admin">
        <Layout>
          <div className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
            <p className="text-gray-600">
              ليس لديك صلاحية لإدارة الأدوار والصلاحيات
            </p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار والصلاحيات</h1>
            <p className="text-gray-600">إنشاء وتعديل أدوار المستخدمين وصلاحياتهم</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            إنشاء دور جديد
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingRole ? 'تعديل الدور' : 'إنشاء دور جديد'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الدور (مفتاح) *
                    </label>
                    <input
                      type="text"
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: branch_manager"
                      required
                      disabled={!!editingRole}
                    />
                    <p className="text-xs text-gray-500 mt-1">يستخدم كمعرف فريد للدور</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم المعروض *
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: مدير فرع"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">الاسم الذي يظهر للمستخدمين</p>
                  </div>
                </div>
                
                {/* Permissions Grid */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">الصلاحيات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(SECTIONS).map((section) => (
                      <div key={section} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{section}</h4>
                        <div className="space-y-2">
                          {Object.values(PERMISSIONS).map((permission) => (
                            <label key={permission} className="flex items-center">
                              <input
                                type="radio"
                                name={`permission_${section}`}
                                value={permission}
                                checked={formData.permissions[section] === permission}
                                onChange={() => updatePermission(section, permission)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                {permission === 'none' && 'لا يوجد وصول'}
                                {permission === 'view' && 'عرض فقط'}
                                {permission === 'edit' && 'تعديل'}
                                {permission === 'admin' && 'إدارة كاملة'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
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
                    {editingRole ? 'تحديث' : 'إنشاء'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Roles List */}
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
                      اسم الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم المعروض
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصلاحيات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.roleName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {role.roleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {role.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          role.isDefault 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {role.isDefault ? 'افتراضي' : 'مخصص'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions || {}).map(([section, permission]) => (
                            <span key={section} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {section}: {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            تعديل
                          </button>
                          {!role.isDefault && (
                            <button
                              onClick={() => handleDelete(role.roleName)}
                              className="text-red-600 hover:text-red-900"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {roles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">لا توجد أدوار مسجلة</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoleManagement; 