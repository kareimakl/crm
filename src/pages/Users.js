import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import { RoleService } from '../services/roleService';
import logo from '../logo.jfif';
// import { getAllUsers, updateUserRole } from '../services/userService'; // To be implemented

const Users = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState('');
  const [editPermissions, setEditPermissions] = useState({});
  const [saving, setSaving] = useState(false);

  // Placeholder: Fetch users (replace with real fetch)
  useEffect(() => {
    setLoading(true);
    AuthService.getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  // Fetch roles when edit modal opens
  useEffect(() => {
    if (editUser) {
      RoleService.getAllRoles().then(setRoles);
      setEditRole(editUser.role || '');
      setEditPermissions(editUser.permissions || {});
    }
  }, [editUser]);

  // Filter users by search
  const filteredUsers = users.filter(u =>
    (u.displayName || '').includes(search) || (u.email || '').includes(search)
  );

  const handleEditSave = async () => {
    setSaving(true);
    await AuthService.updateUser(editUser.uid, {
      role: editRole,
      permissions: editPermissions,
    });
    setEditUser(null);
    setSaving(false);
    // Refresh users
    AuthService.getAllUsers().then(setUsers);
  };

  const handleToggleBan = async (user) => {
    await AuthService.updateUser(user.uid, { isActive: !user.isActive });
    AuthService.getAllUsers().then(setUsers);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">اداره المستخدمين</h1>
      <input
        type="text"
        className="w-full mb-6 p-2 border rounded"
        placeholder="ابحث عن مستخدم..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.uid} className="bg-white rounded shadow p-4 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <img src={user.photoURL || user.avatar || logo} alt="avatar" className="w-20 h-20 rounded-full" />
              </div>
              <div className="font-bold text-lg mb-1">{user.displayName || user.name || user.email}</div>
              <div className="text-sm text-gray-500 mb-1">{user.email}</div>
              <div className="text-xs text-gray-400 mb-2">{user.branch}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.entries(user.permissions || {}).map(([perm, level]) => (
                  <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{perm}: {level}</span>
                ))}
              </div>
              <div className="flex gap-2 w-full mt-2">
                <button
                  className="flex-1 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setEditUser(user)}
                >
                  تعديل الصلاحيات
                </button>
                {user.email !== 'info.mostsharalmdina2030@gmail.com' && (
                  <button
                    className={`flex-1 px-4 py-1 rounded ${user.isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    onClick={() => handleToggleBan(user)}
                  >
                    {user.isActive ? 'حظر' : 'إلغاء الحظر'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit Permissions Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">تعديل صلاحيات المستخدم</h2>
            <div className="mb-4">
              <div className="font-bold">{editUser.displayName || editUser.name || editUser.email}</div>
              <div className="text-sm text-gray-500">{editUser.email}</div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">الدور</label>
              <select
                className="w-full border rounded p-2"
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
              >
                <option value="">اختر دورًا</option>
                {roles.map(role => (
                  <option key={role.roleName} value={role.roleName}>{role.displayName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">الصلاحيات المخصصة (تتجاوز الدور)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {roles.length > 0 &&
                  Object.keys(roles[0].permissions).map(section => (
                    <div key={section} className="flex items-center gap-2">
                      <span className="w-32">{section}</span>
                      <select
                        className="flex-1 border rounded p-1"
                        value={editPermissions[section] || ''}
                        onChange={e => setEditPermissions({ ...editPermissions, [section]: e.target.value })}
                      >
                        <option value="">(من الدور)</option>
                        <option value="none">لا تظهر</option>
                        <option value="view">عرض فقط</option>
                        <option value="edit">تعديل</option>
                        <option value="admin">إدارة</option>
                      </select>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setEditUser(null)}>إلغاء</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleEditSave}
                disabled={saving}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 