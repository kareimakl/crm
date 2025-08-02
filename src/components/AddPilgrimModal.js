import React, { useState } from 'react';

const PROGRAMS = ['٣ أيام مكة مدينة', '٤ أيام مكة مدينة'];
const HOTELS = [
  { id: 1, name: 'فندق مكة المكرمة', price: 500 },
  { id: 2, name: 'فندق المدينة المنورة', price: 400 },
];
const BUSES = [
  { id: 1, name: 'باص VIP', price: 200 },
  { id: 2, name: 'باص اقتصادي', price: 100 },
];

export default function AddPilgrimModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    program: '',
    price: '',
    hotelBooked: false,
    hotelId: '',
    hotelCost: '',
    busBooked: false,
    busId: '',
    busCost: '',
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleHotelSelect = (e) => {
    const hotelId = e.target.value;
    const hotel = HOTELS.find(h => h.id.toString() === hotelId);
    setForm({ ...form, hotelId, hotelCost: hotel ? hotel.price : '' });
  };

  const handleBusSelect = (e) => {
    const busId = e.target.value;
    const bus = BUSES.find(b => b.id.toString() === busId);
    setForm({ ...form, busId, busCost: bus ? bus.price : '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: '',
      program: '',
      price: '',
      hotelBooked: false,
      hotelId: '',
      hotelCost: '',
      busBooked: false,
      busId: '',
      busCost: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rtl">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">إضافة معتمر جديد</h2>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">اسم المعتمر</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium mb-1">نوع البرنامج</label>
            <select className="input-field" name="program" value={form.program} onChange={handleChange} required>
              <option value="">اختر البرنامج</option>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">السعر</label>
            <input className="input-field" name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="hotelBooked" checked={form.hotelBooked} onChange={handleChange} />
            <label className="font-medium">حجز فندق؟</label>
          </div>
          {form.hotelBooked && (
            <div className="flex gap-2">
              <select className="input-field flex-1" name="hotelId" value={form.hotelId} onChange={handleHotelSelect} required>
                <option value="">اختر الفندق</option>
                {HOTELS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <input className="input-field flex-1" name="hotelCost" type="number" value={form.hotelCost} onChange={handleChange} placeholder="تكلفة الفندق" required />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="busBooked" checked={form.busBooked} onChange={handleChange} />
            <label className="font-medium">حجز باص؟</label>
          </div>
          {form.busBooked && (
            <div className="flex gap-2">
              <select className="input-field flex-1" name="busId" value={form.busId} onChange={handleBusSelect} required>
                <option value="">اختر الباص</option>
                {BUSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <input className="input-field flex-1" name="busCost" type="number" value={form.busCost} onChange={handleChange} placeholder="تكلفة الباص" required />
            </div>
          )}
          <button type="submit" className="btn-success w-full mt-4">حفظ</button>
        </form>
      </div>
    </div>
  );
} 