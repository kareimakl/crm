import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SECTIONS } from '../constants/permissions';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Employees = () => {
  const { hasPermissionSync } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    idNumber: '',
    salary: '',
    financialGrade: '',
    allowances: '',
    phone: '',
    personalPhone: '',
    branch: '',
    cvFile: null
  });

  const jobTitles = [
    'مدير',
    'مندوب',
    'محاسب',
    'سائق',
    'موظف إداري',
    'مشرف',
    'محاسب مساعد'
  ];

  const branches = [
    'الفرع الرئيسي',
    'فرع الرياض',
    'فرع جدة',
    'فرع الدمام'
  ];

  const canEdit = hasPermissionSync(SECTIONS.EMPLOYEES, "edit");
  const canAdd = hasPermissionSync(SECTIONS.EMPLOYEES, "edit");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firestore query
      const mockEmployees = [
        { 
          id: 1, 
          name: 'أحمد محمد علي',
          jobTitle: 'مندوب',
          idNumber: '1234567890',
          salary: 5000,
          financialGrade: 'A',
          allowances: 500,
          phone: '0501234567',
          personalPhone: '0501234568',
          branch: 'الفرع الرئيسي',
          cvFile: 'cv_ahmed.pdf',
          createdAt: new Date(),
          isActive: true
        },
        { 
          id: 2, 
          name: 'فاطمة حسن محمد',
          jobTitle: 'محاسب',
          idNumber: '0987654321',
          salary: 6000,
          financialGrade: 'B',
          allowances: 600,
          phone: '0509876543',
          personalPhone: '0509876544',
          branch: 'فرع الرياض',
          cvFile: 'cv_fatima.pdf',
          createdAt: new Date(),
          isActive: true
        }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم الموظف');
      return;
    }

    if (!formData.jobTitle) {
      toast.error('يرجى اختيار الوظيفة');
      return;
    }

    if (!formData.idNumber.trim()) {
      toast.error('يرجى إدخال رقم الهوية');
      return;
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        const updatedEmployees = employees.map(employee =>
          employee.id === editingEmployee.id
            ? { ...employee, ...formData, updatedAt: new Date() }
            : employee
        );
        setEmployees(updatedEmployees);
        toast.success('تم تحديث بيانات الموظف بنجاح');
      } else {
        // Add new employee
        const newEmployee = {
          id: Date.now(),
          ...formData,
          createdAt: new Date(),
          isActive: true
        };
        setEmployees([...employees, newEmployee]);
        toast.success('تم إضافة الموظف بنجاح');
      }
      
      setShowForm(false);
      setEditingEmployee(null);
      setFormData({
        name: '',
        jobTitle: '',
        idNumber: '',
        salary: '',
        financialGrade: '',
        allowances: '',
        phone: '',
        personalPhone: '',
        branch: '',
        cvFile: null
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      jobTitle: employee.jobTitle,
      idNumber: employee.idNumber,
      salary: employee.salary,
      financialGrade: employee.financialGrade,
      allowances: employee.allowances,
      phone: employee.phone,
      personalPhone: employee.personalPhone,
      branch: employee.branch,
      cvFile: employee.cvFile
    });
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    try {
      setEmployees(employees.filter(employee => employee.id !== employeeId));
      toast.success('تم حذف الموظف بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الموظف');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('يرجى اختيار ملف بصيغة PDF أو Word أو PNG');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      
      setFormData({ ...formData, cvFile: file.name });
    }
  };

  const generateAttendanceReport = (employeeId) => {
    // TODO: Implement attendance report generation
    toast.success('تم إنشاء تقرير الحضور والانصراف');
  };

  const generateSalarySheet = (employeeId) => {
    // TODO: Implement salary sheet generation
    toast.success('تم إنشاء مسير الراتب');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      jobTitle: '',
      idNumber: '',
      salary: '',
      financialGrade: '',
      allowances: '',
      phone: '',
      personalPhone: '',
      branch: '',
      cvFile: null
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  return (
    <ProtectedRoute requiredSection={SECTIONS.EMPLOYEES} requiredPermission="view">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
              <p className="text-gray-600">إدارة بيانات الموظفين والرواتب والتقارير</p>
            </div>
            {canAdd && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                إضافة موظف جديد
              </button>
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل الاسم الكامل"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوظيفة *
                      </label>
                      <select
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر الوظيفة</option>
                        {jobTitles.map(title => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهوية *
                      </label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل رقم الهوية"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المرتب الأساسي
                      </label>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل المرتب"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الدرجة المالية
                      </label>
                      <select
                        value={formData.financialGrade}
                        onChange={(e) => setFormData({ ...formData, financialGrade: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر الدرجة</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البدلات
                      </label>
                      <input
                        type="number"
                        value={formData.allowances}
                        onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل البدلات"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الهاتف الرسمي
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل الهاتف الرسمي"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الهاتف الشخصي
                      </label>
                      <input
                        type="tel"
                        value={formData.personalPhone}
                        onChange={(e) => setFormData({ ...formData, personalPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل الهاتف الشخصي"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الفرع
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر الفرع</option>
                        {branches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رفع السيرة الذاتية (PDF/Word/PNG)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.cvFile && (
                      <p className="text-sm text-gray-600 mt-1">الملف المحدد: {formData.cvFile}</p>
                    )}
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
                      {editingEmployee ? 'تحديث' : 'إضافة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Employees List */}
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
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوظيفة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الفرع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المرتب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.branch}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.salary?.toLocaleString()} ريال
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => generateAttendanceReport(employee.id)}
                              className="text-green-600 hover:text-green-900"
                              title="تقرير الحضور"
                            >
                              📊
                            </button>
                            <button
                              onClick={() => generateSalarySheet(employee.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="مسير الراتب"
                            >
                              💰
                            </button>
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => handleEdit(employee)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDelete(employee.id)}
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
              
              {employees.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد موظفين مسجلين</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Employees; 