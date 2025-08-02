import React, { useState, useEffect } from 'react';
import { RoleService } from '../services/roleService';
import toast from 'react-hot-toast';
import sidebarSections from '../components/sidebarSections';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchCustomFields,
  addBranchCustomField,
  updateBranchCustomField,
  deleteBranchCustomField
} from '../services/branchService';
import {
  getRoleCustomFields,
  addRoleCustomField,
  deleteRoleCustomField
} from '../services/roleService';

const Settings = () => {
  const { hasPermissionSync } = useAuth();
  const canManageRoles = hasPermissionSync && hasPermissionSync('الإعدادات', 'admin');
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [formData, setFormData] = useState({
    roleName: '',
    displayName: '',
    permissions: RoleService?.createDefaultRolePermissions ? RoleService.createDefaultRolePermissions() : {}
  });
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [viewRole, setViewRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [editRoleData, setEditRoleData] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingRole, setDeletingRole] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchFormData, setBranchFormData] = useState({ name: '', address: '' });
  const [branchCustomFields, setBranchCustomFields] = useState([]);
  const [loadingBranchFields, setLoadingBranchFields] = useState(true);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({ label: '', type: 'text', options: '' });
  const [branchSections, setBranchSections] = useState([]);
  const [showBranchSectionModal, setShowBranchSectionModal] = useState(false);
  const [newBranchSection, setNewBranchSection] = useState({ label: '', type: 'text', options: [] });
  const [branchSectionOption, setBranchSectionOption] = useState('');
  const [roleSections, setRoleSections] = useState([]);
  const [showRoleSectionModal, setShowRoleSectionModal] = useState(false);
  const [newRoleSection, setNewRoleSection] = useState({ label: '', type: 'text', options: [] });
  const [roleSectionOption, setRoleSectionOption] = useState('');

  const handleRoleSubmit = async (e) => {
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
      await RoleService.createRole(formData);
      toast.success('تم إنشاء الدور بنجاح');
      setShowRoleForm(false);
      setFormData({
        roleName: '',
        displayName: '',
        permissions: RoleService.createDefaultRolePermissions()
      });
      await loadRoles();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
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

  const loadRoles = async () => {
    setLoadingRoles(true);
    const data = await RoleService.getAllRoles();
    setRoles(data);
    setLoadingRoles(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Edit role logic
  const handleEditRole = (role) => {
    setEditRole(role);
    setEditRoleData({
      roleName: role.roleName,
      displayName: role.displayName,
      permissions: { ...role.permissions },
    });
  };
  const handleEditRoleSave = async () => {
    setSavingEdit(true);
    await RoleService.updateRole(editRoleData.roleName, editRoleData);
    setEditRole(null);
    setEditRoleData(null);
    setSavingEdit(false);
    await loadRoles();
  };

  const handleDeleteRole = async (roleName) => {
    setDeleting(true);
    await RoleService.deleteRole(roleName);
    setDeleting(false);
    setDeletingRole(null);
    await loadRoles();
  };

  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const data = await getAllBranches();
      setBranches(data);
    } catch {
      toast.error('حدث خطأ أثناء تحميل الفروع');
    }
    setLoadingBranches(false);
  };

  useEffect(() => { loadBranches(); }, []);

  const loadBranchCustomFields = async () => {
    setLoadingBranchFields(true);
    try {
      const fields = await getBranchCustomFields();
      setBranchCustomFields(fields);
    } catch {}
    setLoadingBranchFields(false);
  };

  useEffect(() => { loadBranchCustomFields(); }, []);

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!branchFormData.name.trim()) {
      toast.error('يرجى إدخال اسم الفرع');
      return;
    }
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, branchFormData);
        toast.success('تم تحديث الفرع بنجاح');
      } else {
        await addBranch(branchFormData);
        toast.success('تم إضافة الفرع بنجاح');
      }
      setShowBranchForm(false);
      setEditingBranch(null);
      setBranchFormData({ name: '', address: '' });
      loadBranches();
    } catch {
      toast.error('حدث خطأ أثناء حفظ الفرع');
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setBranchFormData({ name: branch.name, address: branch.address });
    setShowBranchForm(true);
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الفرع؟')) return;
    try {
      await deleteBranch(id);
      toast.success('تم حذف الفرع بنجاح');
      loadBranches();
    } catch {
      toast.error('حدث خطأ أثناء حذف الفرع');
    }
  };

  const handleAddBranchField = async (e) => {
    e.preventDefault();
    if (!newField.label.trim()) return;
    let field = { ...newField };
    if ((field.type === 'dropdown' || field.type === 'checkbox') && typeof field.options === 'string') {
      field.options = field.options.split(',').map(opt => opt.trim()).filter(Boolean);
    }
    await addBranchCustomField(field);
    setNewField({ label: '', type: 'text', options: '' });
    setShowAddField(false);
    loadBranchCustomFields();
  };

  const handleDeleteBranchField = async (id) => {
    await deleteBranchCustomField(id);
    loadBranchCustomFields();
  };

  const handleAddBranchSection = async () => {
    if (!newBranchSection.label.trim()) return;
    await addBranchCustomField(newBranchSection);
    setNewBranchSection({ label: '', type: 'text', options: [] });
    setShowBranchSectionModal(false);
    getBranchCustomFields().then(setBranchSections);
  };

  const handleDeleteBranchSection = async (id) => {
    await deleteBranchCustomField(id);
    getBranchCustomFields().then(setBranchSections);
  };

  const handleAddBranchSectionOption = () => {
    if (branchSectionOption.trim() && !newBranchSection.options.includes(branchSectionOption)) {
      setNewBranchSection({ ...newBranchSection, options: [...newBranchSection.options, branchSectionOption] });
      setBranchSectionOption('');
    }
  };

  const handleDeleteBranchSectionOption = (opt) => {
    setNewBranchSection({ ...newBranchSection, options: newBranchSection.options.filter(o => o !== opt) });
  };

  const loadRoleCustomFields = async () => {
    const fields = await getRoleCustomFields();
    setRoleSections(fields);
  };

  useEffect(() => { loadRoleCustomFields(); }, []);

  const handleAddRoleSection = async () => {
    if (!newRoleSection.label.trim()) return;
    await addRoleCustomField(newRoleSection);
    setNewRoleSection({ label: '', type: 'text', options: [] });
    setShowRoleSectionModal(false);
    getRoleCustomFields().then(setRoleSections);
  };

  const handleDeleteRoleSection = async (id) => {
    await deleteRoleCustomField(id);
    getRoleCustomFields().then(setRoleSections);
  };

  const handleAddRoleSectionOption = () => {
    if (roleSectionOption.trim() && !newRoleSection.options.includes(roleSectionOption)) {
      setNewRoleSection({ ...newRoleSection, options: [...newRoleSection.options, roleSectionOption] });
      setRoleSectionOption('');
    }
  };

  const handleDeleteRoleSectionOption = (opt) => {
    setNewRoleSection({ ...newRoleSection, options: newRoleSection.options.filter(o => o !== opt) });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      {/* إدارة الصلاحيات */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">إدارة الصلاحيات والأدوار</h2>
        <button className="btn-primary mb-2" onClick={() => setShowRoleForm(true)}>إضافة دور</button>
        {/* Role creation modal */}
        {showRoleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">إنشاء دور جديد</h2>
              <form onSubmit={handleRoleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدور (مفتاح) *</label>
                    <input
                      type="text"
                      value={formData.roleName}
                      onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: branch_manager"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">يستخدم كمعرف فريد للدور</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم المعروض *</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={e => setFormData({ ...formData, displayName: e.target.value })}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sidebarSections.filter(s => !s.adminOnly).map((section) => (
                      <div key={section.section} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{section.name}</h4>
                        <select
                          className="w-full px-2 py-1 border rounded"
                          value={formData.permissions[section.section] || 'none'}
                          onChange={e => updatePermission(section.section, e.target.value)}
                        >
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
                  <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowRoleForm(false)}>إلغاء</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">حفظ</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Dynamic roles list */}
        {loadingRoles ? (
          <div>جاري التحميل...</div>
        ) : roles.length === 0 ? (
          <div className="text-gray-500">لا توجد أدوار بعد</div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="w-full text-right border mt-4 hidden sm:table">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">اسم الدور</th>
                  <th className="p-2">الاسم المعروض</th>
                  <th className="p-2">عدد الصلاحيات</th>
                  {canManageRoles && <th className="p-2">إجراءات</th>}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.roleName} className="border-t">
                    <td className="p-2 font-mono">{role.roleName}</td>
                    <td className="p-2">{role.displayName}</td>
                    <td className="p-2">{Object.keys(role.permissions || {}).length}</td>
                    {canManageRoles && (
                      <td className="p-2 flex gap-2">
                        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setViewRole(role)}>عرض</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => handleEditRole(role)}>تعديل</button>
                        <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => setDeletingRole(role)}>حذف</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile Cards */}
            <div className="flex flex-col gap-4 sm:hidden mt-4">
              {roles.map(role => (
                <div key={role.roleName} className="bg-white rounded shadow p-4 flex flex-col gap-2 border">
                  <div className="font-mono text-xs text-gray-500">{role.roleName}</div>
                  <div className="font-bold text-lg">{role.displayName}</div>
                  <div className="text-sm text-gray-600">عدد الصلاحيات: {Object.keys(role.permissions || {}).length}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {canManageRoles && <>
                      <button className="flex-1 px-2 py-1 bg-gray-200 rounded" onClick={() => setViewRole(role)}>عرض</button>
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded" onClick={() => handleEditRole(role)}>تعديل</button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white rounded" onClick={() => setDeletingRole(role)}>حذف</button>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* View Role Modal */}
        {viewRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">تفاصيل الدور</h2>
              <div className="mb-2"><b>اسم الدور:</b> {viewRole.roleName}</div>
              <div className="mb-2"><b>الاسم المعروض:</b> {viewRole.displayName}</div>
              <div className="mb-2"><b>الصلاحيات:</b></div>
              <ul className="list-disc pr-6">
                {sidebarSections.map(s => (
                  <li key={s.section}>{s.name}: {viewRole.permissions?.[s.section] || 'none'}</li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setViewRole(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Role Modal */}
        {editRole && editRoleData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">تعديل الدور</h2>
              <form onSubmit={e => { e.preventDefault(); handleEditRoleSave(); }} className="space-y-4">
                <div>
                  <label className="block mb-1">اسم الدور</label>
                  <input type="text" className="w-full border rounded p-2" value={editRoleData.roleName} disabled />
                </div>
                <div>
                  <label className="block mb-1">الاسم المعروض</label>
                  <input type="text" className="w-full border rounded p-2" value={editRoleData.displayName} onChange={e => setEditRoleData({ ...editRoleData, displayName: e.target.value })} />
                </div>
                <div>
                  <label className="block mb-1">الصلاحيات</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sidebarSections.map(s => (
                      <div key={s.section} className="flex items-center gap-2">
                        <span className="w-32">{s.name}</span>
                        <select
                          className="flex-1 border rounded p-1"
                          value={editRoleData.permissions[s.section] || 'none'}
                          onChange={e => setEditRoleData({
                            ...editRoleData,
                            permissions: { ...editRoleData.permissions, [s.section]: e.target.value }
                          })}
                        >
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
                  <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => { setEditRole(null); setEditRoleData(null); }}>إلغاء</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={savingEdit}>حفظ</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Role Confirmation Modal */}
        {deletingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">تأكيد حذف الدور</h2>
              <p>هل أنت متأكد أنك تريد حذف الدور <b>{deletingRole.displayName}</b> ({deletingRole.roleName})؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex justify-end gap-2 mt-6">
                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setDeletingRole(null)}>إلغاء</button>
                <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteRole(deletingRole.roleName)} disabled={deleting}>حذف</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* إدارة الفروع */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">إدارة الفروع</h2>
        <button className="btn-primary mb-2" onClick={() => { setShowBranchForm(true); setEditingBranch(null); setBranchFormData({ name: '', address: '' }); }}>إضافة فرع</button>
        {/* Custom fields management */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">الحقول المخصصة</h3>
            <button className="btn-primary px-2 py-1 text-xs" onClick={() => setShowAddField(v => !v)}>{showAddField ? 'إغلاق' : 'إضافة حقل مخصص'}</button>
          </div>
          {showAddField && (
            <form className="flex flex-col gap-2 mb-2" onSubmit={handleAddBranchField}>
              <input className="input-field" type="text" placeholder="اسم الحقل" value={newField.label} onChange={e => setNewField(f => ({ ...f, label: e.target.value }))} required />
              <select className="input-field" value={newField.type} onChange={e => setNewField(f => ({ ...f, type: e.target.value }))}>
                <option value="text">نص</option>
                <option value="dropdown">قائمة منسدلة</option>
                <option value="checkbox">خانات اختيار</option>
              </select>
              {(newField.type === 'dropdown' || newField.type === 'checkbox') && (
                <input className="input-field" type="text" placeholder="القيم (مفصولة بفاصلة)" value={newField.options} onChange={e => setNewField(f => ({ ...f, options: e.target.value }))} />
              )}
              <button className="btn-success" type="submit">حفظ</button>
            </form>
          )}
          {loadingBranchFields ? <div>جاري التحميل...</div> : branchCustomFields.length === 0 ? <div className="text-gray-500">لا توجد حقول مخصصة</div> : (
            <ul className="flex flex-col gap-2">
              {branchCustomFields.map(field => (
                <li key={field.id} className="flex items-center gap-2">
                  <span className="font-bold">{field.label}</span>
                  <span className="text-xs text-gray-500">[{field.type}]</span>
                  {field.options && field.options.length > 0 && <span className="text-xs text-gray-400">({field.options.join(', ')})</span>}
                  <button className="text-xs text-red-600" onClick={() => handleDeleteBranchField(field.id)}>حذف</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* End custom fields management */}
        <div className="mb-4">
          <button className="btn-primary mb-2" onClick={() => setShowBranchSectionModal(true)}>إدارة الحقول المخصصة</button>
          {showBranchSectionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">إدارة الحقول المخصصة للفروع</h2>
                <input className="input-field mb-2" type="text" placeholder="اسم الحقل" value={newBranchSection.label} onChange={e => setNewBranchSection({ ...newBranchSection, label: e.target.value })} />
                <select className="input-field mb-2" value={newBranchSection.type} onChange={e => setNewBranchSection({ ...newBranchSection, type: e.target.value, options: [] })}>
                  <option value="text">نص</option>
                  <option value="dropdown">قائمة منسدلة</option>
                  <option value="checkbox">خانات اختيار</option>
                </select>
                {(newBranchSection.type === 'dropdown' || newBranchSection.type === 'checkbox') && (
                  <div className="mb-2">
                    <div className="flex gap-2 mb-1">
                      <input className="input-field flex-1" type="text" placeholder="قيمة جديدة" value={branchSectionOption} onChange={e => setBranchSectionOption(e.target.value)} />
                      <button type="button" className="btn-primary" onClick={handleAddBranchSectionOption}>إضافة</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newBranchSection.options.map(opt => (
                        <span key={opt} className="bg-gray-200 rounded px-2 py-1 flex items-center gap-1">{opt}<button type="button" className="text-red-500" onClick={() => handleDeleteBranchSectionOption(opt)}>×</button></span>
                      ))}
                    </div>
                  </div>
                )}
                <button className="btn-success w-full mb-2" onClick={handleAddBranchSection}>حفظ</button>
                <ul className="flex flex-col gap-2">
                  {branchSections.map(field => (
                    <li key={field.id} className="flex items-center gap-2">
                      <span className="font-bold">{field.label}</span>
                      <span className="text-xs text-gray-500">[{field.type}]</span>
                      {field.options && field.options.length > 0 && <span className="text-xs text-gray-400">({field.options.join(', ')})</span>}
                      <button className="text-xs text-red-600" onClick={() => handleDeleteBranchSection(field.id)}>حذف</button>
                    </li>
                  ))}
                </ul>
                <button className="btn-secondary w-full mt-2" onClick={() => setShowBranchSectionModal(false)}>إغلاق</button>
              </div>
            </div>
          )}
        </div>
        {showBranchForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editingBranch ? 'تعديل الفرع' : 'إضافة فرع جديد'}</h2>
              <form onSubmit={handleBranchSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفرع *</label>
                  <input type="text" value={branchFormData.name} onChange={e => setBranchFormData({ ...branchFormData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="أدخل اسم الفرع" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <textarea value={branchFormData.address} onChange={e => setBranchFormData({ ...branchFormData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="أدخل عنوان الفرع" rows="3" />
                </div>
                {/* Render custom fields */}
                {branchSections.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'text' && (
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={branchFormData[field.id] || ''} onChange={e => setBranchFormData(f => ({ ...f, [field.id]: e.target.value }))} />
                    )}
                    {field.type === 'dropdown' && (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={branchFormData[field.id] || ''} onChange={e => setBranchFormData(f => ({ ...f, [field.id]: e.target.value }))}>
                        <option value="">اختر</option>
                        {field.options && field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                    {field.type === 'checkbox' && field.options && field.options.map(opt => (
                      <label key={opt} className="inline-flex items-center mr-2">
                        <input type="checkbox" checked={Array.isArray(branchFormData[field.id]) && branchFormData[field.id].includes(opt)} onChange={e => {
                          let arr = Array.isArray(branchFormData[field.id]) ? [...branchFormData[field.id]] : [];
                          if (e.target.checked) arr.push(opt); else arr = arr.filter(v => v !== opt);
                          setBranchFormData(f => ({ ...f, [field.id]: arr }));
                        }} />
                        <span className="ml-1">{opt}</span>
                      </label>
                    ))}
                  </div>
                ))}
                {/* End custom fields */}
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => { setShowBranchForm(false); setEditingBranch(null); setBranchFormData({ name: '', address: '' }); }}>إلغاء</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{editingBranch ? 'تحديث' : 'إضافة'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* إدارة المستخدمين */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">إدارة المستخدمين</h2>
        <button className="btn-primary mb-2">إضافة مستخدم</button>
        <div className="text-gray-500">قائمة المستخدمين (placeholder)</div>
      </div>
    </div>
  );
};

export default Settings; 