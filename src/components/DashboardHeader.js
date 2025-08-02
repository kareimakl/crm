import React from 'react';
import logo from '../logo.jfif'; // Adjust path if your logo is named differently

const DashboardHeader = () => {
  return (
    <header className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 py-3 md:py-4 bg-white/80 backdrop-blur border-b border-gray-100">
      {/* Logo and search */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <img src={logo} alt="Umrah Logo" className="h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow" />
          <span className="font-extrabold text-sm sm:text-lg md:text-xl text-primary-700 tracking-tight hidden xs:block">مستشار المدينة</span>
        </div>
        <div className="hidden lg:flex items-center ml-6">
          <input
            type="text"
            placeholder="بحث..."
            className="input-field bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-64 focus:border-primary-400 focus:ring-primary-200 text-sm"
            dir="rtl"
          />
        </div>
      </div>
      {/* User profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex flex-col items-end mr-1 sm:mr-2">
          <span className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-20 sm:max-w-none">اسلام جمال</span>
          <span className="text-xs text-gray-500 hidden sm:block">مدير النظام</span>
        </div>
        <img
          src={logo}
          alt="Admin Avatar"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-primary-200 shadow"
        />
        <button className="btn-outline px-2 sm:px-3 py-1 text-xs font-bold hidden sm:block">عضو الفريق</button>
      </div>
    </header>
  );
};

export default DashboardHeader; 