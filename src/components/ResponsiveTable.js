import React from 'react';

const ResponsiveTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center">لا توجد بيانات</div>;
  }

  // Get all unique keys from data for dynamic columns
  const columns = Array.from(
    data.reduce((set, item) => {
      Object.keys(item).forEach(key => set.add(key));
      return set;
    }, new Set())
  );

  // Column labels (Arabic)
  const columnLabels = {
    name: 'اسم الصنف',
    type: 'النوع',
    price: 'السعر',
    quantity: 'الكمية',
    date: 'التاريخ',
    supplier: 'تم الشراء من',
    notes: 'ملاحظات',
    // fallback for custom fields: use the key itself
  };

  // Responsive: table for md+, cards for mobile
  return (
    <>
      {/* Table view for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rtl">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col} className="table-header">{columnLabels[col] || col}</th>
              ))}
              <th className="table-header">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col} className="table-cell">{item[col]}</td>
                ))}
                <td className="table-cell flex gap-2">
                  <button className="btn-outline text-xs">عرض</button>
                  <button className="btn-primary text-xs">تعديل</button>
                  <button className="btn-danger text-xs">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="card">
            {columns.map(col => (
              <div key={col} className="mb-1">
                <span className="font-semibold">{columnLabels[col] || col}:</span> {item[col]}
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button className="btn-outline text-xs">عرض</button>
              <button className="btn-primary text-xs">تعديل</button>
              <button className="btn-danger text-xs">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveTable; 