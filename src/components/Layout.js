import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import sidebarSections from './sidebarSections';
import logo from '../logo.jfif';

// Use monochrome icons (SVGs) for a clean, consistent look
const icons = {
  dashboard: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
  ),
  pilgrims: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
  ),
  supplies: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
  ),
  tickets: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2"/></svg>
  ),
  loyalty: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M12 12l3 3-3 3-3-3 3-3z"/></svg>
  ),
  employees: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 21v-2a4 4 0 014-4h2a4 4 0 014 4v2M14 21v-2a4 4 0 014-4h2a4 4 0 014 4v2"/></svg>
  ),
  reports: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm4 14v-4m4 4v-8m4 8v-2"/></svg>
  ),
  settings: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3H9a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09c0 .66.26 1.3.73 1.77z"/></svg>
  ),
  users: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, userRole, signOut, hasPermissionSync } = useAuth();

  // Replace navigationItems with sidebarSections, mapping icon string to icons object
  const navigationItems = sidebarSections.map(item => ({
    ...item,
    icon: icons[item.icon] || null
  }));

  // User info
  const userName = userData?.displayName || userData?.name || userData?.email || '';
  let userAvatar = null;
  if (userData?.photoURL) {
    userAvatar = userData.photoURL;
  } else {
    userAvatar = logo;
  }
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'superadmin';
  const userBranch = userData?.branch || 'الفرع الرئيسي';

  const adminRoles = ['admin', 'superadmin', 'super_admin'];
  const filteredNav = (adminRoles.includes(userRole?.role) || adminRoles.includes(userRole?.roleName))
    ? navigationItems
    : navigationItems.filter(item => !item.adminOnly && hasPermissionSync(item.section));

  // Debug logs
  console.log('userRole:', userRole);
  console.log('filteredNav:', filteredNav);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/login');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed right-0 top-0 bg-white border-l border-gray-200 z-40">
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">نظام العمرة</h1>
          </div>
        <nav className="flex-1 mt-4 px-2 space-y-1">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
              return (
                <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
                }`}
                >
                {item.icon}
                <span className="flex-1 mr-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        <div className="mt-auto p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <img src={userAvatar} alt="avatar" className="w-8 h-8 rounded-full mr-2 border" />
            <div>
              <div className="text-xs text-gray-700 font-bold">{userName}</div>
              <div className="text-xs text-gray-500">{isAdmin ? 'مدير النظام' : userRole?.role || ''}</div>
              <div className="text-xs text-gray-400">{userBranch}</div>
      </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-600"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex flex-col w-64 h-full bg-white border-l border-gray-200 shadow-lg">
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
              <h1 className="text-lg font-semibold text-gray-900 mx-auto">نظام العمرة</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">إغلاق القائمة</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 mt-4 px-2 space-y-1">
              {filteredNav.map((item) => {
                const isActive = location.pathname === item.path;
              return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="flex-1 mr-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
            <div className="mt-auto p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
                <img src={userAvatar} alt="avatar" className="w-8 h-8 rounded-full mr-2 border" />
                <div>
                  <div className="text-xs text-gray-700 font-bold">{userName}</div>
                  <div className="text-xs text-gray-500">{isAdmin ? 'مدير النظام' : userRole?.role || ''}</div>
                  <div className="text-xs text-gray-400">{userBranch}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-red-600"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">فتح القائمة</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 lg:hidden"></div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        </div>
        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 