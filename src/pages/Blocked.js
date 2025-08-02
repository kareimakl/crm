import React from 'react';

const Blocked = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded shadow text-center max-w-md">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold mb-2 text-red-700">تم حظرك من استخدام النظام</h1>
      <p className="mb-4 text-gray-700">لا يمكنك الوصول إلى هذا الموقع حالياً. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الإدارة عبر الواتساب.</p>
      <a
        href="https://wa.me/966574475241"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-lg"
      >
        تواصل عبر الواتساب
      </a>
    </div>
  </div>
);

export default Blocked; 