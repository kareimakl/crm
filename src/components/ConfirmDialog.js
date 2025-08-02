import React from 'react';

const ConfirmDialog = ({ open, onConfirm, onCancel, message, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <div className="text-lg font-bold mb-4 text-center">تأكيد الحذف</div>
        <div className="mb-6 text-center text-gray-700">{message}</div>
        <div className="flex gap-2">
          <button className="btn-danger flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'جاري الحذف...' : 'حذف'}
          </button>
          <button className="btn-outline flex-1" onClick={onCancel} disabled={loading}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 