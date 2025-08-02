import React, { useState } from 'react';

const dummyHotels = [
  { id: 1, name: 'فندق مكة', city: 'مكة', rep: 'أحمد محمد', phone: '0123456789', rooms: 100 },
  { id: 2, name: 'فندق المدينة', city: 'المدينة', rep: 'سارة علي', phone: '0987654321', rooms: 80 },
];

const Hotels = () => {
  const [hotels] = useState(dummyHotels);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">معلومات الفنادق</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">اسم الفندق</th>
              <th className="table-header">المدينة</th>
              <th className="table-header">المندوب</th>
              <th className="table-header">الجوال</th>
              <th className="table-header">عدد الغرف</th>
              <th className="table-header">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h.id}>
                <td className="table-cell">{h.name}</td>
                <td className="table-cell">{h.city}</td>
                <td className="table-cell">{h.rep}</td>
                <td className="table-cell">{h.phone}</td>
                <td className="table-cell">{h.rooms}</td>
                <td className="table-cell">
                  <button className="btn-secondary ml-2">تعديل</button>
                  <button className="btn-danger">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-primary mt-6">إضافة فندق</button>
      {/* نافذة منبثقة لإضافة/تعديل فندق (placeholder) */}
    </div>
  );
};

export default Hotels; 