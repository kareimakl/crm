// Shared sidebar sections for both sidebar and permissions
const sidebarSections = [
  { name: 'لوحة التحكم', path: '/dashboard', section: 'لوحة التحكم', icon: 'dashboard' },
  { name: 'المعتمرين', path: '/pilgrims', section: 'الحجاج', icon: 'pilgrims' },
  { name: 'توريدات', path: '/supplies', section: 'التوريدات', icon: 'supplies' },
  { name: 'التذاكر', path: '/tickets', section: 'التذاكر', icon: 'tickets' },
  { name: 'نظام الولاء', path: '/loyalty', section: 'الولاء', icon: 'loyalty' },
  { name: 'ادارة الموظفين', path: '/employees', section: 'الموظفين', icon: 'employees' },
  { name: 'اداره المستخدمين', path: '/users', section: 'اداره المستخدمين', icon: 'users', adminOnly: true },
  { name: 'التقارير', path: '/reports', section: 'التقارير', icon: 'reports' },
  { name: 'الإعدادات', path: '/settings', section: 'الإعدادات', icon: 'settings' },
];

export default sidebarSections; 