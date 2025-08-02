import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardStatsCard from '../components/DashboardStatsCard';
import DashboardCharts from '../components/DashboardCharts';
import DashboardTable from '../components/DashboardTable';
import { TrophyIcon, StarIcon, DocumentTextIcon, UsersIcon, ChartBarIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all data from backend API
        const [ticketsRes, tripsRes, suppliesRes] = await Promise.all([
          fetch('http://localhost:4000/api/tickets'),
          fetch('http://localhost:4000/api/trips'),
          fetch('http://localhost:4000/api/supplies'),
        ]);
        let tickets = await ticketsRes.json();
        let trips = await tripsRes.json();
        let supplies = await suppliesRes.json();
        if (!Array.isArray(tickets)) tickets = [];
        if (!Array.isArray(trips)) trips = [];
        if (!Array.isArray(supplies)) supplies = [];

        // عدد المعتمرين = عدد التذاكر + عدد التذاكر داخل الرحلات (members in trips)
        const ticketsInTrips = trips.reduce((sum, trip) => sum + (Array.isArray(trip.members) ? trip.members.length : 0), 0);
        const totalPilgrims = tickets.length + ticketsInTrips;

        // عدد الفواتير = عدد بطاقات التوريدات
        const totalInvoices = supplies.length;

        // عدد الرحلات = عدد بطاقات الرحلات
        const totalTrips = trips.length;

        // إجمالي الأرباح = مجموع أسعار التذاكر + مجموع أسعار التوريدات
        const totalTicketRevenue = tickets.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0);
        const totalSuppliesRevenue = supplies.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const totalRevenue = totalTicketRevenue + totalSuppliesRevenue;

        // أفضل معتمر = من دفع أكثر في التذاكر
        const pilgrimSpend = {};
        tickets.forEach(t => {
          if (t.client) {
            pilgrimSpend[t.client] = (pilgrimSpend[t.client] || 0) + (parseFloat(t.price) || 0);
          }
        });
        let bestPilgrim = { name: '—', level: '—' };
        if (Object.keys(pilgrimSpend).length > 0) {
          const maxName = Object.keys(pilgrimSpend).reduce((a, b) => pilgrimSpend[a] > pilgrimSpend[b] ? a : b);
          bestPilgrim = { name: maxName, level: `${pilgrimSpend[maxName].toLocaleString('ar-EG')} ر.س` };
        }

        // Keep these as they are
        const totalPoints = 0;
        const avgRating = 0;

        const statsData = [
          {
            bgColor: 'bg-[#e9f9ee]',
            accentColor: '#7ed957',
            icon: <TrophyIcon className="h-6 w-6" />,
            title: 'أفضل معتمر',
            value: bestPilgrim.name,
            subValue: bestPilgrim.level,
          },
          {
            bgColor: 'bg-[#e3f0fa]',
            accentColor: '#5da9e9',
            icon: <StarIcon className="h-6 w-6" />,
            title: 'إجمالي النقاط',
            value: totalPoints,
            subValue: '+2.5% هذا الشهر',
          },
          {
            bgColor: 'bg-[#fbe7e7]',
            accentColor: '#f7a4a4',
            icon: <DocumentTextIcon className="h-6 w-6" />,
            title: 'عدد الفواتير',
            value: totalInvoices,
            subValue: '+5% هذا الشهر',
          },
          {
            bgColor: 'bg-[#e6e6fa]',
            accentColor: '#a3a3f3',
            icon: <UsersIcon className="h-6 w-6" />,
            title: 'عدد المعتمرين',
            value: totalPilgrims,
            subValue: '+10 هذا الشهر',
          },
          {
            bgColor: 'bg-[#f9fbe7]',
            accentColor: '#e7e97e',
            icon: <ChartBarIcon className="h-6 w-6" />,
            title: 'عدد الرحلات',
            value: totalTrips,
            subValue: '+2 هذا الشهر',
          },
          {
            bgColor: 'bg-[#e7f9fb]',
            accentColor: '#7ed9d9',
            icon: <CurrencyDollarIcon className="h-6 w-6" />,
            title: 'إجمالي الأرباح',
            value: `${totalRevenue.toLocaleString('ar-EG')} ر.س`,
            subValue: '+5% هذا الشهر',
          },
          {
            bgColor: 'bg-[#fbe7fb]',
            accentColor: '#e97ed9',
            icon: <UserGroupIcon className="h-6 w-6" />,
            title: 'متوسط تقييم المعتمرين الولائيين',
            value: avgRating,
            subValue: '+0.1 هذا الشهر',
          },
        ];

        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f6fafd] to-[#e9f9ee] flex items-center justify-center">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6fafd] to-[#e9f9ee] flex flex-col w-full max-w-full min-w-0">
      <DashboardHeader />
      <main className="flex-1 px-2 sm:px-4 md:px-8 py-6 w-full max-w-7xl mx-auto min-w-0">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-primary-700 mb-1">مرحباً بك في لوحة تحكم العمرة!</h2>
          <p className="text-gray-500 text-sm">تابع إحصائيات الحجوزات، الباقات، الإيرادات، وتقييمات العملاء في لمحة.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-6 mb-8">
          {stats.map((s, i) => (
            <div className="min-w-0" key={i}>
              <DashboardStatsCard {...s} />
            </div>
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 gap-y-6">
          <DashboardCharts />
        </div>
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <DashboardTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 