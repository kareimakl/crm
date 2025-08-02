import React, { useState, useEffect } from 'react';

const HR = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch('http://localhost:4000/api/staff');
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        setStaff(data);
      } catch (err) {
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  const handleAddStaff = async (staffData) => {
    await fetch('http://localhost:4000/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    // Refresh from backend
    const res = await fetch('http://localhost:4000/api/staff');
    let newData = await res.json();
    if (!Array.isArray(newData)) newData = [];
    setStaff(newData);
  };

  const handleDeleteStaff = async (id) => {
    await fetch(`http://localhost:4000/api/staff/${id}`, { method: 'DELETE' });
    // Refresh from backend
    const res = await fetch('http://localhost:4000/api/staff');
    let newData = await res.json();
    if (!Array.isArray(newData)) newData = [];
    setStaff(newData);
  };

  const toggleAttendance = (id) => {
    setStaff(staff => staff.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الموظفين</h1>
      <div className="card overflow-x-auto">
        {staff.length === 0 ? (
          <div className="text-center text-gray-500 py-8">لا يوجد موظفين مسجلين</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">الاسم</th>
                <th className="table-header">الوظيفة</th>
                <th className="table-header">الفرع</th>
                <th className="table-header">الراتب</th>
                <th className="table-header">الحضور اليوم</th>
                <th className="table-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="table-cell">{s.name}</td>
                  <td className="table-cell">{s.job}</td>
                  <td className="table-cell">{s.branch}</td>
                  <td className="table-cell">{s.salary} ر.س</td>
                  <td className="table-cell">
                    <button
                      className={`badge ${s.present ? 'badge-success' : 'badge-danger'}`}
                      onClick={() => toggleAttendance(s.id)}
                    >
                      {s.present ? 'حاضر' : 'غائب'}
                    </button>
                  </td>
                  <td className="table-cell">
                    <button className="btn-secondary ml-2">تعديل</button>
                    <button className="btn-danger" onClick={() => handleDeleteStaff(s.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
        <button className="btn-primary">إضافة موظف</button>
        <button className="btn-outline">تصدير إلى CSV</button>
      </div>
      {/* نافذة منبثقة لإضافة/تعديل موظف (placeholder) */}
      {/* مكان رفع السيرة الذاتية (CV) */}
    </div>
  );
};

export default HR; 