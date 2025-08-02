import React from 'react';

export default function PilgrimsTable({ pilgrims, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-100 rtl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* The add button will be outside this component */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">اسم المعتمر</th>
              <th className="table-header">اسم البرنامج</th>
              <th className="table-header">السعر</th>
              <th className="table-header">الفندق</th>
              <th className="table-header">تكلفة الفندق</th>
              <th className="table-header">الباص</th>
              <th className="table-header">تكلفة الباص</th>
              <th className="table-header">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {pilgrims.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="table-cell font-bold text-gray-800">{p.name}</td>
                <td className="table-cell">{p.program}</td>
                <td className="table-cell">{p.price} ر.س</td>
                <td className="table-cell">{p.hotelBooked ? p.hotelName : '-'}</td>
                <td className="table-cell">{p.hotelBooked ? p.hotelCost + ' ر.س' : '-'}</td>
                <td className="table-cell">{p.busBooked ? p.busName : '-'}</td>
                <td className="table-cell">{p.busBooked ? p.busCost + ' ر.س' : '-'}</td>
                <td className="table-cell">
                  <button className="btn-outline text-xs mr-2" onClick={() => onEdit && onEdit(p, idx)}>تعديل</button>
                  <button className="btn-danger text-xs" onClick={() => onDelete && onDelete(idx)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 