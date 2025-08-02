import React, { useState, useRef } from 'react';
import logo from '../logo.jfif';
import qr from '../QR code.png';
import html2canvas from 'html2canvas';

function TicketModal({ open, onClose, ticket }) {
  const modalRef = useRef();
  const [downloadMode, setDownloadMode] = useState(false);
  if (!open) return null;
  const handleDownload = async () => {
    setDownloadMode(true);
    await new Promise(r => setTimeout(r, 50));
    if (!modalRef.current) return;
    const canvas = await html2canvas(modalRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `تذكرة_${ticket.name || 'منتج'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloadMode(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rtl">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 relative">
        <div
          ref={modalRef}
          className={downloadMode ? 'rtl p-6 bg-white rounded-2xl' : 'rtl'}
          style={downloadMode ? { boxSizing: 'border-box', width: '100%', height: '100%' } : {}}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" />
              تفاصيل التذكرة
            </h2>
            <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={onClose}>✕</button>
          </div>
          <hr className="mb-2" />
          <div className="text-sm space-y-2">
            {ticket.name && (
              <div className="flex justify-between">
                <span className="font-semibold">اسم التذكرة:</span>
                <span>{ticket.name}</span>
              </div>
            )}
            {ticket.type && (
              <div className="flex justify-between">
                <span className="font-semibold">نوع الخدمة:</span>
                <span>{ticket.type}</span>
              </div>
            )}
            {ticket.price && (
              <div className="flex justify-between">
                <span className="font-semibold">السعر:</span>
                <span>{ticket.price} ريال</span>
              </div>
            )}
            {ticket.date && (
              <div className="flex justify-between">
                <span className="font-semibold">تاريخ الرحلة:</span>
                <span>{ticket.date}</span>
              </div>
            )}
            {ticket.client && (
              <div className="flex justify-between">
                <span className="font-semibold">اسم العميل:</span>
                <span>{ticket.client}</span>
              </div>
            )}
            {ticket.phone && (
              <div className="flex justify-between">
                <span className="font-semibold">رقم التليفون:</span>
                <span>{ticket.phone}</span>
              </div>
            )}
            {ticket.channel && (
              <div className="flex justify-between">
                <span className="font-semibold">قناة الوصول:</span>
                <span>{ticket.channel}</span>
              </div>
            )}
            {ticket.nationalId && (
              <div className="flex justify-between">
                <span className="font-semibold">الهوية:</span>
                <span>{ticket.nationalId}</span>
              </div>
            )}
            {ticket.nationality && (
              <div className="flex justify-between">
                <span className="font-semibold">الجنسية:</span>
                <span>{ticket.nationality}</span>
              </div>
            )}
            {/* Conditional fields */}
            {ticket.driverName && (
              <div className="flex justify-between">
                <span className="font-semibold">راعي الباص:</span>
                <span>{ticket.driverName}</span>
              </div>
            )}
            {ticket.hotelSupplier && (
              <div className="flex justify-between">
                <span className="font-semibold">مورد الفندق:</span>
                <span>{ticket.hotelSupplier}</span>
              </div>
            )}
            {ticket.airline && (
              <div className="flex justify-between">
                <span className="font-semibold">شركة الطيران:</span>
                <span>{ticket.airline}</span>
              </div>
            )}
            {ticket.umrahItems && ticket.umrahItems.length > 0 && (
              <div className="flex justify-between">
                <span className="font-semibold">مستلزمات العمرة:</span>
                <span>{ticket.umrahItems.join(', ')}</span>
              </div>
            )}
            {/* Custom fields */}
            {ticket.extra_fields && Object.keys(ticket.extra_fields).length > 0 && (
              <div className="pt-2">
                <span className="font-semibold">بيانات إضافية:</span>
                <ul className="list-disc pr-5 mt-1 text-xs text-gray-700">
                  {Object.entries(ticket.extra_fields).map(([k, v]) => (
                    <li key={k}><span className="font-semibold">{k}:</span> {v}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <img src={qr} alt="qr code" className="w-32 h-32 rounded bg-gray-100 border" />
            </div>
          </div>
        </div>
        <button
          className="btn-success w-full mt-4 text-lg rounded"
          onClick={handleDownload}
        >
          تحميل التذكرة
        </button>
      </div>
    </div>
  );
}

export default function TicketCard({ ticket, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 rtl">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold">{ticket.name}</div>
          <span className="badge badge-info">{ticket.type}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">السعر:</span> {ticket.price} ريال</div>
          <div><span className="font-semibold">التاريخ:</span> {ticket.date}</div>
          {ticket.client && <div><span className="font-semibold">العميل:</span> {ticket.client}</div>}
        </div>
        {ticket.extra_fields && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
            {Object.entries(ticket.extra_fields).map(([k, v]) => (
              <div key={k}><span className="font-semibold">{k}:</span> {v}</div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button className="btn-outline flex-1" onClick={() => setShowModal(true)}>
            عرض التفاصيل
          </button>
          <button className="btn-primary flex-1" onClick={() => onEdit && onEdit(ticket.id, ticket)}>
            تعديل
          </button>
          <button className="btn-danger flex-1" onClick={() => onDelete && onDelete(ticket.id)}>
            حذف
          </button>
        </div>
      </div>
      <TicketModal open={showModal} onClose={() => setShowModal(false)} ticket={ticket} />
    </>
  );
} 