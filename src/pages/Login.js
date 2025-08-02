import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  // Check if this is the first time (no users exist)
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const users = await AuthService.getAllUsers();
        setIsFirstTime(users.length === 0);
      } catch (error) {
        console.error('Error checking first time:', error);
      }
    };
    checkFirstTime();
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await AuthService.signInWithGoogle();
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirstAdmin = async (e) => {
    e.preventDefault();
    
    if (adminData.password !== adminData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (adminData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      await AuthService.createFirstAdmin(adminData.email, adminData.password, adminData.name);
      toast.success('تم إنشاء حساب المدير العام بنجاح');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
    setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني أولاً');
      return;
    }

    try {
      await AuthService.resetPassword(email);
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isFirstTime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🕌</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              إعداد النظام
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              إنشاء حساب المدير العام الأول
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleCreateFirstAdmin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={adminData.name}
                  onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل البريد الإلكتروني"
                  required
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور *
                </label>
                <input
                  type="password"
                  value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  required
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تأكيد كلمة المرور *
                </label>
                <input
                  type="password"
                  value={adminData.confirmPassword}
                  onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  'إنشاء حساب المدير العام'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                هذا الحساب سيكون له صلاحيات كاملة على النظام
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🕌</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            نظام إدارة الحج والعمرة
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
                <input
                  id="password"
                  name="password"
                type="password"
                  autoComplete="current-password"
                  required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
                أو
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              تسجيل الدخول بحساب Google
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            للدعم الفني: <span className="text-blue-600">support@umrah.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 