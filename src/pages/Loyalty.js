import React, { useState, useEffect } from 'react';

const Loyalty = () => {
  const [topClients, setTopClients] = useState([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalReferrals: 0,
    avgRating: 0,
    monthlyUsage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoyaltyData() {
      try {
        const res = await fetch('http://localhost:4000/api/loyalty');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setTopClients(data);
          
          // Calculate stats from the data
          const totalPoints = data.reduce((sum, client) => sum + (client.points || 0), 0);
          const totalReferrals = data.reduce((sum, client) => sum + (client.referrals || 0), 0);
          const avgRating = data.length > 0 ? 
            (data.reduce((sum, client) => sum + (client.rating || 0), 0) / data.length).toFixed(1) : 0;
          
          setStats({
            totalPoints,
            totalReferrals,
            avgRating,
            monthlyUsage: data.filter(client => client.last_usage_month === new Date().getMonth() + 1).length,
          });
        }
      } catch (err) {
        console.error('Error fetching loyalty data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLoyaltyData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">برنامج الولاء للمعتمرين</h1>
      {/* إحصائيات البرنامج */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-gray-500 text-sm mb-1">إجمالي النقاط المصدرة</div>
          <div className="text-2xl font-bold">{stats.totalPoints}</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm mb-1">عدد الإحالات</div>
          <div className="text-2xl font-bold">{stats.totalReferrals}</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm mb-1">متوسط التقييم</div>
          <div className="text-2xl font-bold">{stats.avgRating}</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm mb-1">استخدام المكافآت هذا الشهر</div>
          <div className="text-2xl font-bold">{stats.monthlyUsage}</div>
        </div>
      </div>
      {/* أفضل المعتمرين */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">أفضل المعتمرين حسب الولاء</h2>
        {topClients.length === 0 ? (
          <div className="text-center text-gray-500 py-8">لا توجد بيانات ولاء متاحة</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">الاسم</th>
                <th className="table-header">النقاط</th>
                <th className="table-header">المستوى</th>
                <th className="table-header">عدد الحجوزات</th>
                <th className="table-header">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((c) => (
                <tr key={c.id}>
                  <td className="table-cell">{c.name}</td>
                  <td className="table-cell font-bold text-primary-700">{c.points}</td>
                  <td className="table-cell">
                    <span className={`badge ${c.level === 'بلاتيني' ? 'badge-info' : c.level === 'ذهبي' ? 'badge-warning' : 'badge-success'}`}>{c.level}</span>
                  </td>
                  <td className="table-cell">{c.bookings || 0}</td>
                  <td className="table-cell">{c.rating || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* أدوات الإدارة */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">إدارة النقاط والمكافآت</h2>
        <div className="text-gray-500 mb-2">يمكنك تعديل أو إلغاء نقاط أي معتمر من خلال صفحة المعتمرين.</div>
        <button className="btn-primary">تعديل النقاط يدويًا</button>
        {/* مكان لإدارة الحملات، مراجعة الإحالات، تقارير الولاء الشهرية */}
      </div>
    </div>
  );
};

export default Loyalty; 