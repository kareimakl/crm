import React, { useState } from 'react';

const invoiceTabs = [
  { key: 'ehram', label: 'إحرام' },
  { key: 'bus', label: 'باص' },
  { key: 'hotel', label: 'فندق' },
  { key: 'flight', label: 'طيران' },
  { key: 'other', label: 'خدمات أخرى' },
];

const dummyInvoices = {
  ehram: [
    { id: 1, product: 'إحرام قطن', buyPrice: 30, sellPrice: 50, size: 'XL', quantity: 2, notes: '' },
  ],
  bus: [
    { id: 1, trip: 'رحلة 1', pilgrim: 'محمد أحمد', seats: 10, total: 1500, status: 'مدفوع', phone: '0501234567' },
  ],
  hotel: [
    { id: 1, hotel: 'فندق مكة', rep: 'أحمد محمد', bus: 'باص 1', date: '2024-06-01', notes: '' },
  ],
  flight: [
    { id: 1, flightNo: 'SV123', airline: 'السعودية', price: 800, source: 'الرياض', notes: '' },
  ],
  other: [],
};

const Invoices = () => {
  const [activeTab, setActiveTab] = useState('ehram');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الفواتير</h1>
      {/* Tabs */}
      <div className="flex space-x-2 space-x-reverse mb-4">
        {invoiceTabs.map(tab => (
          <button
            key={tab.key}
            className={`btn-outline ${activeTab === tab.key ? 'btn-primary text-white' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Table for active tab */}
      <div className="card overflow-x-auto">
        {activeTab === 'ehram' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">اسم المنتج</th>
                <th className="table-header">سعر الشراء</th>
                <th className="table-header">سعر البيع</th>
                <th className="table-header">المقاس</th>
                <th className="table-header">الكمية</th>
                <th className="table-header">ملاحظات</th>
                <th className="table-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.ehram.map((inv) => (
                <tr key={inv.id}>
                  <td className="table-cell">{inv.product}</td>
                  <td className="table-cell">{inv.buyPrice} ر.س</td>
                  <td className="table-cell">{inv.sellPrice} ر.س</td>
                  <td className="table-cell">{inv.size}</td>
                  <td className="table-cell">{inv.quantity}</td>
                  <td className="table-cell">{inv.notes}</td>
                  <td className="table-cell">
                    <button className="btn-secondary ml-2">تعديل</button>
                    <button className="btn-danger">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'bus' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">الرحلة</th>
                <th className="table-header">المعتمر</th>
                <th className="table-header">الجوال</th>
                <th className="table-header">عدد المقاعد</th>
                <th className="table-header">الإجمالي</th>
                <th className="table-header">الحالة</th>
                <th className="table-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.bus.map((inv) => (
                <tr key={inv.id}>
                  <td className="table-cell">{inv.trip}</td>
                  <td className="table-cell">{inv.pilgrim}</td>
                  <td className="table-cell">{inv.phone}</td>
                  <td className="table-cell">{inv.seats}</td>
                  <td className="table-cell">{inv.total} ر.س</td>
                  <td className="table-cell">
                    <span className="badge badge-success">{inv.status}</span>
                  </td>
                  <td className="table-cell">
                    <button className="btn-secondary ml-2">تعديل</button>
                    <button className="btn-danger">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'hotel' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">الفندق</th>
                <th className="table-header">المندوب</th>
                <th className="table-header">الباص</th>
                <th className="table-header">التاريخ</th>
                <th className="table-header">ملاحظات</th>
                <th className="table-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.hotel.map((inv) => (
                <tr key={inv.id}>
                  <td className="table-cell">{inv.hotel}</td>
                  <td className="table-cell">{inv.rep}</td>
                  <td className="table-cell">{inv.bus}</td>
                  <td className="table-cell">{inv.date}</td>
                  <td className="table-cell">{inv.notes}</td>
                  <td className="table-cell">
                    <button className="btn-secondary ml-2">تعديل</button>
                    <button className="btn-danger">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'flight' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">رقم الرحلة</th>
                <th className="table-header">شركة الطيران</th>
                <th className="table-header">السعر</th>
                <th className="table-header">المصدر</th>
                <th className="table-header">ملاحظات</th>
                <th className="table-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.flight.map((inv) => (
                <tr key={inv.id}>
                  <td className="table-cell">{inv.flightNo}</td>
                  <td className="table-cell">{inv.airline}</td>
                  <td className="table-cell">{inv.price} ر.س</td>
                  <td className="table-cell">{inv.source}</td>
                  <td className="table-cell">{inv.notes}</td>
                  <td className="table-cell">
                    <button className="btn-secondary ml-2">تعديل</button>
                    <button className="btn-danger">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'other' && (
          <div className="text-gray-400 text-center py-8">لا توجد بيانات</div>
        )}
      </div>
      <button className="btn-primary mt-6">إضافة فاتورة</button>
      {/* نافذة منبثقة لإضافة/تعديل فاتورة (placeholder) */}
    </div>
  );
};

export default Invoices; 