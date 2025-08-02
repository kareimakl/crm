import React, { useState } from 'react';
import logo from '../logo.jfif';

export default function SupplyFormModal({ open, onClose, onSubmit, existingTypes }) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    quantity: '',
    date: '',
    time: '',
    supplier: '',
    trn: '',
    extra_fields: {},
  });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomField = () => {
    if (customFieldLabel && customFieldValue) {
      setForm({
        ...form,
        extra_fields: { ...form.extra_fields, [customFieldLabel]: customFieldValue }
      });
      setCustomFieldLabel('');
      setCustomFieldValue('');
    }
  };

  const handleAddCustomType = () => {
    if (customType) {
      setForm({ ...form, type: customType });
      setCustomType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    setForm({
      name: '',
      type: '',
      price: '',
      quantity: '',
      date: '',
      time: '',
      supplier: '',
      trn: '',
      extra_fields: {},
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg rtl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-xl font-bold">إضافة فاتورة توريد</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">اسم الصنف</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium mb-1">النوع</label>
            <select className="input-field" name="type" value={form.type} onChange={handleChange} required>
              <option value="">اختر النوع</option>
              {existingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <input
                className="input-field flex-1"
                placeholder="أضف نوع جديد"
                value={customType}
                onChange={e => setCustomType(e.target.value)}
              />
              <button type="button" className="btn-outline" onClick={handleAddCustomType}>إضافة النوع</button>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">السعر للوحدة</label>
            <input className="input-field" name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium mb-1">الكمية</label>
            <input className="input-field" name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">تاريخ الفاتورة</label>
              <input className="input-field" name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">وقت الفاتورة</label>
              <input className="input-field" name="time" type="time" value={form.time} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">اسم المورد</label>
            <input className="input-field" name="supplier" value={form.supplier} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">الرقم الضريبي (TRN)</label>
            <input className="input-field" name="trn" value={form.trn} onChange={handleChange} maxLength={15} minLength={15} required />
          </div>
          {/* Custom fields */}
          <div className="bg-gray-50 rounded-lg p-2 mt-2">
            <div className="flex gap-2 mb-2">
              <input
                className="input-field flex-1"
                placeholder="أضف سؤال مخصص"
                value={customFieldLabel}
                onChange={e => setCustomFieldLabel(e.target.value)}
              />
              <input
                className="input-field flex-1"
                placeholder="الإجابة"
                value={customFieldValue}
                onChange={e => setCustomFieldValue(e.target.value)}
              />
              <button type="button" className="btn-outline" onClick={handleAddCustomField}>إضافة</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(form.extra_fields).map(([k, v]) => (
                <div key={k} className="bg-white border rounded px-2 py-1 text-xs flex items-center gap-1">
                  <span className="font-semibold">{k}:</span> {v}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-success w-full mt-4" disabled={loading}>{loading ? '...جاري الحفظ' : 'حفظ'}</button>
        </form>
      </div>
    </div>
  );
} 