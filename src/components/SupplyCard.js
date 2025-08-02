import React, { useState, useRef } from 'react';
import logo from '../logo.jfif';
import qr from '../QR code.png';
import html2canvas from 'html2canvas';

function InvoiceModal({ open, onClose, supply }) {
  const modalRef = useRef();
  const [downloadMode, setDownloadMode] = useState(false);
  if (!open) return null;
  // Calculate VAT (15%)
  const total = Number(supply.price) * Number(supply.quantity);
  const vat = Math.round(total * 0.15 * 100) / 100;
  const totalWithVat = Math.round((total + vat) * 100) / 100;
  // TRN validation: 15 digits, first and last are 3
  const trn = supply.trn || '312345678901234';
  const trnValid = trn.length === 15 && trn[0] === '3' && trn[14] === '3';

  const handleDownload = async () => {
    setDownloadMode(true);
    await new Promise(r => setTimeout(r, 50)); // allow re-render
    if (!modalRef.current) return;
    const canvas = await html2canvas(modalRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `فاتورة_${supply.name || 'توريد'}.png`;
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
              تفاصيل الفاتورة
            </h2>
            <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={onClose}>✕</button>
          </div>
          <hr className="mb-2" />
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">اسم البائع:</span>
              <span>مستشار المدينة</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">الرقم الضريبي للبائع:</span>
              <span className={trnValid ? 'text-gray-800' : 'text-red-600 font-bold'}>{trn}</span>
              {!trnValid && (
                <span className="text-xs text-red-500">يجب أن يتكون الرقم الضريبي من 15 رقمًا، ويبدأ وينتهي بـ 3</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">تاريخ/وقت الفاتورة:</span>
              <span>{supply.date} {supply.time || ''}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span></span>
              <span>{supply.date && supply.time ? new Date(`${supply.date}T${supply.time}`).toISOString() : ''}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="font-semibold">اسم الصنف:</span>
              <span>{supply.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">النوع:</span>
              <span>{supply.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">الكمية:</span>
              <span>{supply.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">السعر للوحدة:</span>
              <span>{supply.price} ريال</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">اسم المورد:</span>
              <span>{supply.supplier}</span>
            </div>
            {supply.extra_fields && Object.keys(supply.extra_fields).length > 0 && (
              <div className="pt-2">
                <span className="font-semibold">بيانات إضافية:</span>
                <ul className="list-disc pr-5 mt-1 text-xs text-gray-700">
                  {Object.entries(supply.extra_fields).map(([k, v]) => (
                    <li key={k}><span className="font-semibold">{k}:</span> {v}</li>
                  ))}
                </ul>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-base mt-2">
              <span className="font-semibold">إجمالي الفاتورة (شامل الضريبة):</span>
              <span className="font-bold text-green-700">{totalWithVat} ريال</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">ضريبة القيمة المضافة:</span>
              <span>{vat} ريال</span>
            </div>
            <div className="flex justify-center mt-4">
              <img src={qr} alt="qr code" className="w-32 h-32 rounded bg-gray-100 border" />
            </div>
          </div>
        </div>
        <button
          className="btn-success w-full mt-4 text-lg rounded"
          onClick={handleDownload}
        >
          تحميل الفاتوره
        </button>
      </div>
    </div>
  );
}

export default function SupplyCard({ supply, onEdit, onDelete }) {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 rtl">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold">{supply.name}</div>
          <span className="badge badge-info">{supply.type}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">الكمية:</span> {supply.quantity}</div>
          <div><span className="font-semibold">السعر:</span> {supply.price} ريال</div>
          <div><span className="font-semibold">التاريخ:</span> {supply.date}</div>
          <div><span className="font-semibold">المورد:</span> {supply.supplier}</div>
        </div>
        {supply.extra_fields && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
            {Object.entries(supply.extra_fields).map(([k, v]) => (
              <div key={k}><span className="font-semibold">{k}:</span> {v}</div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button className="btn-outline flex-1" onClick={() => setShowInvoice(true)}>
            عرض الفاتوره
          </button>
          <button className="btn-primary flex-1" onClick={() => onEdit && onEdit(supply.id, supply)}>
            تعديل
          </button>
          <button className="btn-danger flex-1" onClick={() => onDelete && onDelete(supply.id)}>
            حذف
          </button>
        </div>
      </div>
      <InvoiceModal open={showInvoice} onClose={() => setShowInvoice(false)} supply={supply} />
    </>
  );
} 