import React from 'react';

const TRIP_TYPE_LABELS = {
  bus: 'باص',
  hotel: 'فندق',
  umrah: 'مستلزمات عمرة',
  flight: 'طيران'
};

const TRIP_TYPE_ICONS = {
  bus: '🚌',
  hotel: '🏨',
  umrah: '🕋',
  flight: '✈️'
};

export default function TripCard({ trip, onDelete, onBusDetails, onPilgrimList, onAddTicket, onExportExcel }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3 rtl">
      <div className="flex flex-col gap-1 mb-2">
        <div className="text-lg font-bold">{trip.tripName}</div>
        <div className="text-sm text-gray-600">تاريخ الرحلة: {trip.tripDate}</div>
        {trip.notes && <div className="text-sm text-gray-500">ملاحظات: {trip.notes}</div>}
        <div className="text-sm text-blue-700 font-semibold">
          عدد الأفراد في الرحلة: {trip.passengers ? trip.passengers.length : 0}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <button
          className="btn-primary rounded-2xl px-6 py-2 text-lg w-full"
          onClick={onAddTicket}
        >
          إضافة تذكرة
        </button>
        {onExportExcel && (
          <button
            className="btn-success rounded-2xl px-6 py-2 text-lg w-full"
            onClick={onExportExcel}
          >
            تحميل xlsx
          </button>
        )}
        {onDelete && (
          <button
            className="btn-danger rounded-2xl px-6 py-2 text-lg w-full"
            onClick={onDelete}
          >
            حذف الرحلة
          </button>
        )}
      </div>
    </div>
  );
} 