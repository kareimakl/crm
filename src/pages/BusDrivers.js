import React, { useState } from 'react';

const dummyBuses = [
  { id: 1, busNo: 'باص 1', driver: 'سعيد حسن', phone: '0501112222', seats: 50 },
  { id: 2, busNo: 'باص 2', driver: 'خالد يوسف', phone: '0553334444', seats: 45 },
];

const BusDrivers = () => {
  const [buses] = useState(dummyBuses);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">معلومات الباصات والسائقين</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">رقم الباص</th>
              <th className="table-header">اسم السائق</th>
              <th className="table-header">الجوال</th>
              <th className="table-header">عدد المقاعد</th>
              <th className="table-header">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b) => (
              <tr key={b.id}>
                <td className="table-cell">{b.busNo}</td>
                <td className="table-cell">{b.driver}</td>
                <td className="table-cell">{b.phone}</td>
                <td className="table-cell">{b.seats}</td>
                <td className="table-cell">
                  <button className="btn-secondary ml-2">تعديل</button>
                  <button className="btn-danger">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-primary mt-6">إضافة باص/سائق</button>
      {/* نافذة منبثقة لإضافة/تعديل باص أو سائق (placeholder) */}
    </div>
  );
};

export default BusDrivers; 