import React, { useState, useEffect } from 'react';

export default function PilgrimsSidebar() {
  const [stats, setStats] = useState({
    topCustomers: [],
    satisfaction: { rate: 0, count: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('http://localhost:4000/api/pilgrims-stats');
        const data = await res.json();
        setStats({
          topCustomers: data.topCustomers || [],
          satisfaction: data.satisfaction || { rate: 0, count: 0 }
        });
      } catch (err) {
        console.error('Error fetching sidebar stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="h-32 flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="flex flex-col gap-6 rtl">
      {/* Weekly Top Customer */}
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
        <div className="font-bold text-gray-700 mb-2">أفضل عميل أسبوعياً</div>
        <div className="flex flex-col gap-3">
          {stats.topCustomers.length === 0 ? (
            <div className="text-gray-400 text-center">لا يوجد بيانات</div>
          ) : (
            stats.topCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={c.avatar_url || `https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={c.name} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.points} نقطة</div>
                </div>
                <span className="text-xs text-gray-400">#{i+1}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Satisfaction Rate */}
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-100 flex flex-col items-center">
        <div className="font-bold text-gray-700 mb-2">معدل الرضا</div>
        <div className="relative flex items-center justify-center w-20 h-20 mb-2">
          <svg className="w-20 h-20" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#f3f4f6" strokeWidth="4" />
            <circle cx="20" cy="20" r="18" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (stats.satisfaction.rate / 100) * 113} />
          </svg>
          <span className="absolute text-xl font-bold text-orange-500">{stats.satisfaction.rate}%</span>
        </div>
        <div className="text-xs text-gray-400">بناءً على {stats.satisfaction.count.toLocaleString('ar-EG')} تقييم</div>
      </div>
    </div>
  );
} 