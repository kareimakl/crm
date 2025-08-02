import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SECTIONS } from '../constants/permissions';

const ProtectedRoute = ({ children, requiredSection = null, requiredPermission = "view" }) => {
  const { currentUser, userData, userRole, loading, hasPermissionSync } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser || !userData) {
    return <Navigate to="/login" replace />;
  }

  // If no specific section is required, just check authentication
  if (!requiredSection) {
    return children;
  }

  // Check if user has permission for the required section
  const hasAccess = hasPermissionSync(requiredSection, requiredPermission);
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
          <p className="text-gray-600 mb-4">
            ليس لديك صلاحية للوصول إلى {requiredSection}
          </p>
          <p className="text-sm text-gray-500">
            يرجى التواصل مع مدير النظام للحصول على الصلاحيات المطلوبة
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 