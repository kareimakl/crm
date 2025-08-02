import React, { useState } from 'react';

export default function Pilgrims() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSelectedTicket(null);
    try {
      const res = await fetch(`http://localhost:4000/api/tickets?client=${encodeURIComponent(query)}`);
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      setResults(data);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rtl bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            className="input-field flex-1"
            placeholder="ابحث باسم العميل..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="btn-primary px-6" type="submit" disabled={loading}>
            {loading ? 'جاري البحث...' : 'بحث'}
          </button>
        </form>
        {results.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">لا توجد نتائج</div>
        )}
        <div className="flex flex-col gap-4">
          {results.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100">
              <div className="font-bold text-lg text-primary-700">{ticket.client}</div>
              <div className="text-sm text-gray-500">نوع الخدمة: {ticket.type}</div>
              <div className="text-sm text-gray-500">التاريخ: {ticket.date}</div>
              <div className="text-sm text-gray-500">السعر: {ticket.price} ر.س</div>
              <button className="btn-secondary w-max mt-2" onClick={() => setSelectedTicket(ticket)}>
                عرض التفاصيل
              </button>
              {selectedTicket && selectedTicket.id === ticket.id && (
                <div className="mt-4 bg-gray-50 rounded p-3 border border-gray-200 text-sm">
                  <div>اسم العميل: {selectedTicket.client}</div>
                  <div>نوع الخدمة: {selectedTicket.type}</div>
                  <div>السعر: {selectedTicket.price} ر.س</div>
                  <div>الكمية: {selectedTicket.quantity}</div>
                  <div>التاريخ: {selectedTicket.date}</div>
                  <div>سياسة الاسترجاع: {selectedTicket.return_policy}</div>
                  <div>تسليم: {selectedTicket.delivery ? 'نعم' : 'لا'}</div>
                  <div>ملاحظات: {selectedTicket.notes || '-'}</div>
                  <div>رقم الهاتف: {selectedTicket.phone || '-'}</div>
                  <div>الجنسية: {selectedTicket.nationality || '-'}</div>
                  <div>الهوية: {selectedTicket.nationalId || '-'}</div>
                  <div>مندوب: {selectedTicket.representative || '-'}</div>
                  <div>قناة الوصول: {selectedTicket.channel || '-'}</div>
                  {selectedTicket.extra_fields && Object.keys(selectedTicket.extra_fields).length > 0 && (
                    <div className="mt-2">
                      <div className="font-bold">حقول إضافية:</div>
                      {Object.entries(selectedTicket.extra_fields).map(([k, v]) => (
                        <div key={k}>{k}: {v}</div>
                      ))}
                    </div>
                  )}
                  <button className="btn-outline mt-3" onClick={() => setSelectedTicket(null)}>إغلاق</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 