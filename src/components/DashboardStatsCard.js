import React from 'react';

const DashboardStatsCard = ({ bgColor, icon, title, value, subValue, chartBar, accentColor }) => {
  return (
    <div
      className={`rounded-2xl px-6 py-5 flex flex-col gap-2 shadow-none border border-white/40 ${bgColor} min-w-[200px] min-h-[120px]`}
      style={{ background: bgColor, borderColor: accentColor || 'rgba(255,255,255,0.2)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 rounded-full bg-white/60 flex items-center justify-center shadow-sm" style={{ color: accentColor }}>
          {icon}
        </div>
        <span className="font-bold text-gray-700 text-sm flex-1 text-right">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-extrabold text-gray-900">{value}</span>
        {subValue && <span className="text-xs text-success-600 font-bold">{subValue}</span>}
      </div>
      {/* Mini bar chart or placeholder */}
      {chartBar && <div className="mt-2">{chartBar}</div>}
    </div>
  );
};

export default DashboardStatsCard; 