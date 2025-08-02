import React, { useState } from 'react';

const dummyReports = [
  { id: 1, type: 'إحرام', date: '2024-05-01', seats: 10, revenue: 5000, pilgrim: 'محمد أحمد' },
  { id: 2, type: 'باص', date: '2024-05-02', seats: 20, revenue: 10000, pilgrim: 'سارة علي' },
];

const Reports = () => {
  const [reports] = useState(dummyReports);
  const [filter, setFilter] = useState('');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">التقارير</h1>
      {/* فلاتر */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          className="input-field"
          placeholder="بحث باسم المعتمر أو نوع الفاتورة..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button className="btn-outline">تصفية</button>
        <button className="btn-outline">تصدير إلى Excel</button>
      </div>
      {/* جدول التقارير */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">نوع الفاتورة</th>
              <th className="table-header">التاريخ</th>
              <th className="table-header">عدد المقاعد</th>
              <th className="table-header">الإيرادات</th>
              <th className="table-header">المعتمر الأكثر نشاطاً</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="table-cell">{r.type}</td>
                <td className="table-cell">{r.date}</td>
                <td className="table-cell">{r.seats}</td>
                <td className="table-cell">{r.revenue} ر.س</td>
                <td className="table-cell">{r.pilgrim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ملخص */}
      <div className="card mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>إجمالي المقاعد: <span className="font-bold">30</span></div>
          <div>إجمالي الإيرادات: <span className="font-bold">15,000 ر.س</span></div>
          <div>المعتمر الأكثر نشاطاً: <span className="font-bold">محمد أحمد</span></div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 