import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

const PilgrimCard = ({ pilgrim, onDetails, onEdit }) => {
  return (
    <div
      className="relative mb-6 animate-fade-in-up group overflow-hidden rounded-2xl shadow-xl border border-white/30 bg-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl hover:border-primary-300"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
    >
      {/* Accent border */}
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-tr-2xl rounded-br-2xl" />
      {/* Card content */}
      <div className="p-5 flex flex-col gap-2 z-10 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-100 p-2 rounded-full shadow-md">
            <UserIcon className="h-7 w-7 text-primary-500" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-lg text-gray-900 drop-shadow-sm">{pilgrim.name}</div>
            <div className="text-xs text-gray-500">{pilgrim.nationality}</div>
          </div>
          <span className={`badge px-3 py-1 text-base font-bold ${pilgrim.level === 'بلاتيني' ? 'badge-info' : pilgrim.level === 'ذهبي' ? 'badge-warning' : 'badge-success'}`}>{pilgrim.level}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-semibold">الجوال:</span>
          <span dir="ltr">{pilgrim.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-semibold">عدد الحجوزات:</span>
          <span>{pilgrim.bookings}</span>
        </div>
        {/* Floating action bar */}
        <div className="flex gap-2 mt-4 opacity-90 group-hover:opacity-100 transition-all">
          <button
            className="flex-1 btn-outline bg-white/60 backdrop-blur-md border border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 shadow-sm"
            onClick={onDetails}
            style={{ boxShadow: '0 2px 8px 0 rgba(14, 165, 233, 0.08)' }}
          >
            <span className="font-semibold">عرض التفاصيل</span>
          </button>
          <button
            className="flex-1 btn-secondary bg-gradient-to-l from-primary-500 to-secondary-400 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-transform duration-150"
            onClick={onEdit}
          >
            تعديل
          </button>
        </div>
      </div>
      {/* Glassmorphism animated background blobs */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-200 opacity-30 rounded-full blur-2xl animate-blob1" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-200 opacity-30 rounded-full blur-2xl animate-blob2" />
    </div>
  );
};

export default PilgrimCard;

// Tailwind custom animations (add to tailwind.config.js if not present):
// fade-in-up, blob1, blob2 