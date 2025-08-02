import React, { useState, useEffect } from 'react';

const DashboardTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentBookings() {
      try {
        const res = await fetch('http://localhost:4000/api/recent-bookings');
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        setBookings(data);
      } catch (err) {
        console.error('Error fetching recent bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentBookings();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/80 border border-white/40 p-6 mt-6">
        <div className="font-bold text-gray-700 mb-4">قائمة الحجوزات الأخيرة</div>
        <div className="text-center text-gray-500 py-8">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/80 border border-white/40 p-6 mt-6 overflow-x-auto">
      <div className="font-bold text-gray-700 mb-4">قائمة الحجوزات الأخيرة</div>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 py-8">لا توجد حجوزات حديثة</div>
      ) : (
        <table className="min-w-full text-sm text-right">
          <thead>
            <tr className="text-gray-500">
              <th className="px-4 py-2">اسم المعتمر</th>
              <th className="px-4 py-2">الباقة</th>
              <th className="px-4 py-2">الجوال</th>
              <th className="px-4 py-2">السعر الإجمالي</th>
              <th className="px-4 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-primary-50/30 transition">
                <td className="px-4 py-2 font-bold text-gray-900">{b.name || 'غير محدد'}</td>
                <td className="px-4 py-2">{b.package || 'غير محدد'}</td>
                <td className="px-4 py-2" dir="ltr">{b.phone || 'غير محدد'}</td>
                <td className="px-4 py-2 text-primary-700 font-bold">
                  {(b.total_price || 0).toLocaleString('ar-EG')} ر.س
                </td>
                <td className="px-4 py-2">{b.date || 'غير محدد'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardTable; 