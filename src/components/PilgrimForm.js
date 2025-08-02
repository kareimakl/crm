import React, { useState } from 'react';

const defaultState = {
  name: '',
  nationality: '',
  phone: '',
  passport: '',
  bookings: 0,
  seatsBooked: 0,
  campaignName: '',
  departureDate: '',
  busReserved: false,
  totalPrice: '',
  points: 0,
  level: 'فضي',
  rating: 0,
};

const PilgrimForm = ({ initialData = {}, onSubmit, onCancel, loading, error }) => {
  const [form, setForm] = useState({ ...defaultState, ...initialData });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.nationality || !form.phone) {
      setFormError('يرجى تعبئة جميع الحقول الأساسية');
      return;
    }
    setFormError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <div className="text-danger-600 text-sm mb-2">{formError}</div>}
      {error && <div className="text-danger-600 text-sm mb-2">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">الاسم</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">الجنسية</label>
        <input name="nationality" className="input-field" value={form.nationality} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">الجوال</label>
        <input name="phone" className="input-field" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">رقم الجواز</label>
        <input name="passport" className="input-field" value={form.passport} onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">عدد الحجوزات</label>
        <input name="bookings" type="number" className="input-field" value={form.bookings} onChange={handleChange} min={0} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">عدد المقاعد المحجوزة</label>
        <input name="seatsBooked" type="number" className="input-field" value={form.seatsBooked} onChange={handleChange} min={0} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">اسم الحملة</label>
        <input name="campaignName" className="input-field" value={form.campaignName} onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">موعد الذهاب</label>
        <input name="departureDate" type="date" className="input-field" value={form.departureDate} onChange={handleChange} />
      </div>
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium mb-1">حجز باص؟</label>
        <input name="busReserved" type="checkbox" checked={form.busReserved} onChange={handleChange} />
        <span>{form.busReserved ? '✅' : '❌'}</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">السعر الإجمالي</label>
        <input name="totalPrice" type="number" className="input-field" value={form.totalPrice} onChange={handleChange} min={0} />
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </button>
        <button type="button" className="btn-outline flex-1" onClick={onCancel} disabled={loading}>
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default PilgrimForm; 