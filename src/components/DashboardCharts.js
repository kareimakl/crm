import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString('ar-EG')} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts = () => {
  const [chartData, setChartData] = useState({
    packageDistribution: [],
    weeklyRevenue: [],
    pilgrimGrowth: [],
    revenueExpenses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch('http://localhost:4000/api/dashboard-charts');
        const data = await res.json();
        setChartData({
          packageDistribution: data.packageDistribution || [],
          weeklyRevenue: data.weeklyRevenue || [],
          pilgrimGrowth: data.pilgrimGrowth || [],
          revenueExpenses: data.revenueExpenses || []
        });
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">جاري تحميل الرسوم البيانية...</div>
      </div>
    );
  }

  const totalPilgrims = (chartData.packageDistribution || []).reduce((sum, item) => sum + (item.value || 0), 0);

  return (
  <div className="grid grid-cols-1 gap-6 mt-4">
    {/* Enhanced Pie Chart */}
    <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">توزيع الباقات</h3>
          <div className="text-sm text-gray-500">إجمالي: {totalPilgrims} معتمر</div>
      </div>
        {chartData.packageDistribution.length > 0 ? (
          <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
                  data={chartData.packageDistribution}
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={30}
            dataKey="value"
            animationDuration={1000}
            animationBegin={0}
          >
                  {chartData.packageDistribution.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.packageDistribution.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-600">{item.name}</span>
                  <span className="font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">لا توجد بيانات متاحة</div>
        )}
    </div>

    {/* Enhanced Bar Chart */}
    <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">الإيرادات الأسبوعية</h3>
        <div className="text-sm text-gray-500">آخر 7 أيام</div>
      </div>
        {chartData.weeklyRevenue.length > 0 ? (
      <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.weeklyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="day" 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#barGradient)" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={0}
          />
        </BarChart>
      </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">لا توجد بيانات متاحة</div>
        )}
    </div>

    {/* Line Chart */}
    <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">نمو المعتمرين</h3>
        <div className="text-sm text-gray-500">آخر 6 أشهر</div>
      </div>
        {chartData.pilgrimGrowth.length > 0 ? (
      <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.pilgrimGrowth} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="pilgrims" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            animationDuration={1000}
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">لا توجد بيانات متاحة</div>
        )}
    </div>

    {/* Area Chart */}
    <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">الإيرادات والمصروفات</h3>
        <div className="text-sm text-gray-500">آخر 7 أيام</div>
      </div>
        {chartData.revenueExpenses.length > 0 ? (
      <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData.revenueExpenses} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="day" 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
                stackId="1"
            stroke="#10B981" 
            fill="url(#revenueGradient)"
            animationDuration={1000}
            animationBegin={0}
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
                stackId="2"
            stroke="#EF4444" 
            fill="url(#expensesGradient)"
            animationDuration={1000}
                animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">لا توجد بيانات متاحة</div>
        )}
    </div>
  </div>
);
};

export default DashboardCharts; 