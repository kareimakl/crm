import React, { useState, useEffect } from 'react';

export default function PilgrimsStatsCards() {
  const [stats, setStats] = useState({
    estimatedCost: 0,
    totalClients: 0,
    totalMembers: 0,
    newPilgrims: 0,
    programPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('http://localhost:4000/api/pilgrims-stats');
        const data = await res.json();
        setStats({
          estimatedCost: data.estimatedCost || 0,
          totalClients: data.totalClients || 0,
          totalMembers: data.totalMembers || 0,
          newPilgrims: data.newPilgrims || 0,
          programPerformance: data.programPerformance || []
        });
      } catch (err) {
        console.error('Error fetching pilgrims stats:', err);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 rtl">
      {/* إجمالي التكلفة المقدرة */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100">
        <div className="text-sm text-gray-500 font-semibold">إجمالي التكلفة المقدرة</div>
        <div className="text-2xl font-bold text-gray-900">{stats.estimatedCost.toLocaleString('ar-EG')} ر.س</div>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <span>+٤٣٪</span>
          <span className="text-gray-400">عن الشهر الماضي</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">تم تحسين التكلفة المقدرة بـ ٢٬٣٢٨ ر.س عن الشهر الماضي</div>
      </div>
      {/* العملاء */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100">
        <div className="text-sm text-gray-500 font-semibold">العملاء</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalClients.toLocaleString('ar-EG')}</div>
        <div className="h-6 w-full flex items-end gap-1 mt-1">
          {/* Bar chart placeholder */}
          {[4, 8, 6, 10, 7, 12, 5, 9, 6, 8, 7, 10].map((h, i) => (
            <div key={i} className="bg-orange-200 rounded" style={{ width: 4, height: h * 2 }} />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">تمت معالجة {stats.totalClients.toLocaleString('ar-EG')} عميل إجمالاً</div>
      </div>
      {/* الأعضاء */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100">
        <div className="text-sm text-gray-500 font-semibold">الأعضاء</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalMembers.toLocaleString('ar-EG')}</div>
        <div className="flex -space-x-2 mt-1">
          {/* Avatar group placeholder */}
          {[1,2,3,4,5].map(i => (
            <img key={i} src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt="عضو" className="w-7 h-7 rounded-full border-2 border-white" />
          ))}
          <span className="bg-gray-200 text-xs rounded-full px-2 py-1 ml-2">+٩٩</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">الأعضاء النشطون الآن</div>
      </div>
      {/* عدد المعتمرين الجدد هذا الشهر */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100 items-center justify-center">
        <div className="text-sm text-gray-500 font-semibold">عدد المعتمرين الجدد هذا الشهر</div>
        <div className="text-2xl font-bold text-blue-600">{stats.newPilgrims.toLocaleString('ar-EG')}</div>
        <div className="w-full h-8 flex items-end gap-1 mt-2">
          {/* Simple bar chart for new pilgrims */}
          {[2, 4, 3, 6, 5, 8, 4, 7, 6, 5, 7, 8].map((h, i) => (
            <div key={i} className="bg-blue-200 rounded" style={{ width: 6, height: h * 4 }} />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">زيادة ١٢٪ عن الشهر الماضي</div>
      </div>
      {/* أداء البرامج */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100 items-center justify-center">
        <div className="text-sm text-gray-500 font-semibold">أداء البرامج</div>
        <div className="w-full flex flex-col gap-2 mt-2">
          {stats.programPerformance.map((prog, i) => (
            <div key={prog.name} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700 w-32 truncate">{prog.name}</span>
              <div className="flex-1 bg-gray-100 rounded h-3 relative">
                <div
                  className="bg-orange-400 h-3 rounded"
                  style={{ width: `${Math.max(10, (prog.count / Math.max(...stats.programPerformance.map(p => p.count))) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-orange-700 w-10 text-left">{prog.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 