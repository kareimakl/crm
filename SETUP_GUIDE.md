# 🚀 دليل إعداد Firebase - Setup Guide

## 📋 المتطلبات الأساسية

1. **Node.js** (v14 أو أحدث)
2. **npm** أو **yarn**
3. **حساب Google** (لـ Firebase)
4. **Firebase CLI** (مثبت بالفعل)

## 🔧 خطوات الإعداد

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على **"إنشاء مشروع"** أو **"Create Project"**
3. أدخل اسم المشروع: `mostashar-elmadina`
4. اختر **"تمكين Google Analytics"** (اختياري)
5. انقر **"إنشاء المشروع"**

### 2. إعداد Authentication

1. في Firebase Console، اذهب إلى **Authentication**
2. انقر على **"Get Started"**
3. في تبويب **"Sign-in method"**:
   - فعّل **Email/Password**
   - فعّل **Google**
4. انقر **"Save"**

### 3. إعداد Firestore Database

1. اذهب إلى **Firestore Database**
2. انقر **"Create Database"**
3. اختر **"Start in test mode"** (سنقوم بتحديث القواعد لاحقاً)
4. اختر موقع قاعدة البيانات (يفضل `europe-west1` للشرق الأوسط)

### 4. إعداد Storage

1. اذهب إلى **Storage**
2. انقر **"Get Started"**
3. اختر **"Start in test mode"**
4. اختر نفس موقع قاعدة البيانات

### 5. الحصول على بيانات التكوين

1. اذهب إلى **Project Settings** (⚙️)
2. في تبويب **"General"**، ابحث عن **"Your apps"**
3. انقر على أيقونة **Web** (</>)
4. أدخل اسم التطبيق: `mostashar-elmadina-web`
5. انقر **"Register app"**
6. انسخ بيانات التكوين:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6. تحديث بيانات التكوين في المشروع

1. افتح `src/firebase/config.js`
2. استبدل `firebaseConfig` بالبيانات الجديدة
3. احفظ الملف

### 7. تسجيل الدخول إلى Firebase CLI

```bash
firebase login
```

### 8. تهيئة المشروع

```bash
firebase init
```

اختر الخيارات التالية:
- **Firestore**: ✅
- **Hosting**: ✅
- **Storage**: ✅
- **Project**: اختر مشروعك
- **Public directory**: `build`
- **Single-page app**: ✅
- **Overwrite index.html**: ❌

### 9. نشر قواعد الأمان

```bash
firebase deploy --only firestore:rules,storage
```

### 10. تشغيل المشروع

```bash
npm start
```

## 👤 إنشاء أول حساب مدير

1. افتح التطبيق في المتصفح
2. ستظهر شاشة **"إعداد النظام"**
3. أدخل بيانات المدير العام:
   - **الاسم الكامل**: اسم المدير
   - **البريد الإلكتروني**: بريد المدير
   - **كلمة المرور**: كلمة مرور قوية
   - **تأكيد كلمة المرور**: نفس كلمة المرور
4. انقر **"إنشاء حساب المدير العام"**

## 🔐 إدارة المستخدمين

### إنشاء مستخدمين جدد (كمدير عام)

1. سجل دخول كمدير عام
2. اذهب إلى **الإعدادات** → **إدارة الأدوار**
3. يمكنك إنشاء أدوار جديدة أو تعديل الأدوار الموجبة
4. لإنشاء مستخدم جديد:
   - اذهب إلى Firebase Console → Authentication
   - انقر **"Add User"**
   - أدخل البريد الإلكتروني وكلمة المرور
   - في Firestore، أضف وثيقة في مجموعة `users` مع البيانات المطلوبة

### الأدوار الافتراضية

1. **super_admin**: صلاحيات كاملة
2. **branch_admin**: إدارة فرع محدد
3. **rep**: إدارة الحجاج والتذاكر
4. **accountant**: إدارة الفواتير والتقارير

## 🛡️ الأمان

### قواعد Firestore
- تم نشر قواعد الأمان تلقائياً
- تحمي البيانات بناءً على أدوار المستخدمين
- تمنع الوصول غير المصرح به

### قواعد Storage
- تسمح برفع الملفات للمستخدمين المسجلين
- تحمي ملفات CV والصور الشخصية

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في المصادقة**:
   - تأكد من تفعيل Email/Password في Firebase Console
   - تأكد من صحة بيانات التكوين

2. **خطأ في قاعدة البيانات**:
   - تأكد من إنشاء Firestore Database
   - تأكد من نشر قواعد الأمان

3. **خطأ في Google Sign-In**:
   - تأكد من تفعيل Google في Authentication
   - تأكد من إضافة domain في Authorized domains

### أوامر مفيدة

```bash
# عرض حالة Firebase
firebase projects:list

# نشر التطبيق
firebase deploy

# عرض السجلات
firebase functions:log

# إعادة تعيين كلمة المرور
firebase auth:export users.json
```

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع سجلات Firebase Console
2. تحقق من قواعد الأمان
3. تأكد من صحة بيانات التكوين
4. راجع هذا الدليل مرة أخرى

---

**ملاحظة**: هذا الدليل مخصص للإعداد الأولي. بعد الإعداد، يمكنك تخصيص النظام حسب احتياجاتك. 