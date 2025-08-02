import React, { useState, useEffect } from 'react';
import logo from '../logo.jfif';

export default function TicketEditModal({ open, onClose, onSubmit, ticket, existingTypes }) {
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    tripDate: '',
    serviceType: [],
    price: '',
    driverName: '',
    hotelSupplier: '',
    umrahItems: [],
    airline: '',
    channel: '',
    nationalId: '',
    nationality: '',
    extra_fields: {},
    representative: '',
    target: '',
    delivery: false,
    return_policy: '',
  });

  const [drivers, setDrivers] = useState(['أحمد علي', 'محمد حسن', 'علي أحمد']);
  const [hotelSuppliers, setHotelSuppliers] = useState(['فندق مكة المكرمة', 'فندق المدينة المنورة', 'فندق دار الإيمان']);
  const [umrahItems, setUmrahItems] = useState(['إحرام', 'سجادة', 'مسبحة', 'مظلة', 'حقيبة']);
  const [airlines, setAirlines] = useState(['الخطوط الجوية السعودية', 'طيران الإمارات', 'الخطوط الجوية القطرية']);
  const [representatives, setRepresentatives] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [customSections, setCustomSections] = useState([]);

  const [newDriver, setNewDriver] = useState('');
  const [newHotel, setNewHotel] = useState('');
  const [newUmrahItem, setNewUmrahItem] = useState('');
  const [newAirline, setNewAirline] = useState('');

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  useEffect(() => {
    if (ticket) {
      setForm({
        clientName: ticket.client || '',
        phone: ticket.phone || '',
        tripDate: ticket.date || '',
        serviceType: ticket.type ? [ticket.type] : [],
        price: ticket.price || '',
        driverName: ticket.driverName || '',
        hotelSupplier: ticket.hotelSupplier || '',
        umrahItems: ticket.umrahItems || [],
        airline: ticket.airline || '',
        channel: ticket.channel || '',
        nationalId: ticket.nationalId || '',
        nationality: ticket.nationality || '',
        extra_fields: ticket.extra_fields || {},
        representative: ticket.representative || '',
        target: ticket.target || '',
        delivery: ticket.delivery || false,
        return_policy: ticket.return_policy || '',
      });
    }
  }, [ticket]);

  const loadData = async () => {
    try {
      // Load representatives
      const repsResponse = await fetch('http://localhost:4000/api/representatives');
      if (repsResponse.ok) {
        const repsData = await repsResponse.json();
        setRepresentatives(repsData.map(r => r.name));
      }

      // Load nationalities
      const natResponse = await fetch('http://localhost:4000/api/nationalities');
      if (natResponse.ok) {
        const natData = await natResponse.json();
        setNationalities(natData.map(n => n.name));
      }

      // Load channels
      const chanResponse = await fetch('http://localhost:4000/api/channels');
      if (chanResponse.ok) {
        const chanData = await chanResponse.json();
        setChannels(chanData.map(c => c.name));
      }

      // Load custom sections
      const sectionsResponse = await fetch('http://localhost:4000/api/custom-sections');
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        setCustomSections(sectionsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addDriver = () => {
    if (newDriver.trim() && !drivers.includes(newDriver)) {
      setDrivers([...drivers, newDriver]);
      setNewDriver('');
    }
  };

  const deleteDriver = (d) => setDrivers(drivers.filter(x => x !== d));

  const addHotel = () => {
    if (newHotel.trim() && !hotelSuppliers.includes(newHotel)) {
      setHotelSuppliers([...hotelSuppliers, newHotel]);
      setNewHotel('');
    }
  };

  const deleteHotel = (h) => setHotelSuppliers(hotelSuppliers.filter(x => x !== h));

  const addUmrahItem = () => {
    if (newUmrahItem.trim() && !umrahItems.includes(newUmrahItem)) {
      setUmrahItems([...umrahItems, newUmrahItem]);
      setNewUmrahItem('');
    }
  };

  const deleteUmrahItem = (u) => setUmrahItems(umrahItems.filter(x => x !== u));

  const addAirline = () => {
    if (newAirline.trim() && !airlines.includes(newAirline)) {
      setAirlines([...airlines, newAirline]);
      setNewAirline('');
    }
  };

  const deleteAirline = (a) => setAirlines(airlines.filter(x => x !== a));

  const addRep = async () => {
    const newRep = prompt('أدخل اسم المندوب الجديد:');
    if (newRep && !representatives.includes(newRep)) {
      try {
        const response = await fetch('http://localhost:4000/api/representatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newRep })
        });
        if (response.ok) {
          setRepresentatives([...representatives, newRep]);
        }
      } catch (error) {
        console.error('Error adding representative:', error);
      }
    }
  };

  const deleteRep = async (repName) => {
    try {
      const rep = representatives.find(r => r === repName);
      if (rep) {
        const response = await fetch(`http://localhost:4000/api/representatives/${rep.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setRepresentatives(representatives.filter(r => r !== repName));
        }
      }
    } catch (error) {
      console.error('Error deleting representative:', error);
    }
  };

  const addNationality = async () => {
    const newNat = prompt('أدخل الجنسية الجديدة:');
    if (newNat && !nationalities.includes(newNat)) {
      try {
        const response = await fetch('http://localhost:4000/api/nationalities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newNat })
        });
        if (response.ok) {
          setNationalities([...nationalities, newNat]);
        }
      } catch (error) {
        console.error('Error adding nationality:', error);
      }
    }
  };

  const deleteNationality = async (nationalityName) => {
    try {
      const nat = nationalities.find(n => n === nationalityName);
      if (nat) {
        const response = await fetch(`http://localhost:4000/api/nationalities/${nat.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setNationalities(nationalities.filter(n => n !== nationalityName));
        }
      }
    } catch (error) {
      console.error('Error deleting nationality:', error);
    }
  };

  const addChannel = async () => {
    const newChan = prompt('أدخل القناة الجديدة:');
    if (newChan && !channels.includes(newChan)) {
      try {
        const response = await fetch('http://localhost:4000/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newChan })
        });
        if (response.ok) {
          setChannels([...channels, newChan]);
        }
      } catch (error) {
        console.error('Error adding channel:', error);
      }
    }
  };

  const deleteChannel = async (channelName) => {
    try {
      const chan = channels.find(c => c === channelName);
      if (chan) {
        const response = await fetch(`http://localhost:4000/api/channels/${chan.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setChannels(channels.filter(c => c !== channelName));
        }
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  const handleCustomSectionChange = (sectionId, value) => {
    const section = customSections.find(s => s.id === sectionId);
    if (section) {
      setForm({
        ...form,
        extra_fields: { ...form.extra_fields, [section.label]: value }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ticket.id, form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg rtl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-xl font-bold">تعديل التذكرة</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">اسم العميل</label>
            <input className="input-field" name="clientName" value={form.clientName} onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block font-medium mb-1">رقم التليفون</label>
            <input className="input-field" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block font-medium mb-1">تاريخ الرحلة</label>
            <input className="input-field" name="tripDate" type="date" value={form.tripDate} onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block font-medium mb-1">نوع الخدمة</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {existingTypes.map(type => (
                <label key={type} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="serviceType"
                    value={type}
                    checked={form.serviceType.includes(type)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setForm(prev => ({
                        ...prev,
                        serviceType: checked
                          ? [...prev.serviceType, type]
                          : prev.serviceType.filter(t => t !== type)
                      }));
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            {form.serviceType.length === 0 && (
              <div className="text-xs text-red-500 mt-1">يرجى اختيار نوع خدمة واحد على الأقل</div>
            )}
          </div>

          {/* Conditional fields with add/delete */}
          {form.serviceType.includes('باص') && (
            <div>
              <label className="block font-medium mb-1">راعي الباص</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {drivers.map(d => (
                  <span key={d} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                    {d}
                    <button type="button" className="text-red-500 text-xs" onClick={() => deleteDriver(d)}>🗑️</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input className="input-field flex-1" placeholder="إضافة سائق جديد" value={newDriver} onChange={e => setNewDriver(e.target.value)} />
                <button type="button" className="btn-outline" onClick={addDriver}>إضافة</button>
              </div>
              <select className="input-field" name="driverName" value={form.driverName} onChange={handleChange} required>
                <option value="">اختر راعي الباص</option>
                {drivers.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          {form.serviceType.includes('فندق') && (
            <div>
              <label className="block font-medium mb-1">مورد الفندق</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {hotelSuppliers.map(h => (
                  <span key={h} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                    {h}
                    <button type="button" className="text-red-500 text-xs" onClick={() => deleteHotel(h)}>🗑️</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input className="input-field flex-1" placeholder="إضافة مورد جديد" value={newHotel} onChange={e => setNewHotel(e.target.value)} />
                <button type="button" className="btn-outline" onClick={addHotel}>إضافة</button>
              </div>
              <select className="input-field" name="hotelSupplier" value={form.hotelSupplier} onChange={handleChange} required>
                <option value="">اختر المورد</option>
                {hotelSuppliers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          )}

          {form.serviceType.includes('مستلزمات عمرة') && (
            <div>
              <label className="block font-medium mb-1">المستلزمات</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {umrahItems.map(item => (
                  <span key={item} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                    {item}
                    <button type="button" className="text-red-500 text-xs" onClick={() => deleteUmrahItem(item)}>🗑️</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input className="input-field flex-1" placeholder="إضافة مستلزم جديد" value={newUmrahItem} onChange={e => setNewUmrahItem(e.target.value)} />
                <button type="button" className="btn-outline" onClick={addUmrahItem}>إضافة</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {umrahItems.map(item => (
                  <label key={item} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="umrahItems"
                      value={item}
                      checked={form.umrahItems.includes(item)}
                      onChange={handleChange}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {form.serviceType.includes('طيران') && (
            <div>
              <label className="block font-medium mb-1">شركة الطيران</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {airlines.map(a => (
                  <span key={a} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                    {a}
                    <button type="button" className="text-red-500 text-xs" onClick={() => deleteAirline(a)}>🗑️</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input className="input-field flex-1" placeholder="إضافة شركة طيران جديدة" value={newAirline} onChange={e => setNewAirline(e.target.value)} />
                <button type="button" className="btn-outline" onClick={addAirline}>إضافة</button>
              </div>
              <select className="input-field" name="airline" value={form.airline} onChange={handleChange} required>
                <option value="">اختر شركة الطيران</option>
                {airlines.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">السعر</label>
            <input className="input-field" name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>

          <div>
            <label className="block font-medium mb-1">الجنسية</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {nationalities.map(nat => (
                <span key={nat} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {nat}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteNationality(nat)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button type="button" className="btn-outline" onClick={addNationality}>إضافة جنسية</button>
            </div>
            <select className="input-field" name="nationality" value={form.nationality} onChange={handleChange}>
              <option value="">اختر الجنسية</option>
              {nationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">رقم الهوية</label>
            <input className="input-field" name="nationalId" value={form.nationalId} onChange={handleChange} />
          </div>

          <div>
            <label className="block font-medium mb-1">المندوب</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {representatives.map(rep => (
                <span key={rep} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {rep}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteRep(rep)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button type="button" className="btn-outline" onClick={addRep}>إضافة مندوب</button>
            </div>
            <select className="input-field" name="representative" value={form.representative} onChange={handleChange}>
              <option value="">اختر المندوب</option>
              {representatives.map(rep => <option key={rep} value={rep}>{rep}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">قناة الوصول</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {channels.map(chan => (
                <span key={chan} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {chan}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteChannel(chan)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button type="button" className="btn-outline" onClick={addChannel}>إضافة قناة</button>
            </div>
            <select className="input-field" name="channel" value={form.channel} onChange={handleChange}>
              <option value="">اختر قناة الوصول</option>
              {channels.map(chan => <option key={chan} value={chan}>{chan}</option>)}
            </select>
          </div>



          {/* Custom Sections */}
          {customSections.map(section => (
            <div key={section.id} className="p-3 border rounded-lg">
              <label className="block font-medium mb-2">{section.label}</label>
              
              {section.type === 'text' && (
                <input
                  type="text"
                  className="input-field"
                  value={form.extra_fields[section.label] || ''}
                  onChange={(e) => handleCustomSectionChange(section.id, e.target.value)}
                  placeholder={`أدخل ${section.label}`}
                />
              )}
              
              {section.type === 'dropdown' && (
                <select
                  className="input-field"
                  value={form.extra_fields[section.label] || ''}
                  onChange={(e) => handleCustomSectionChange(section.id, e.target.value)}
                >
                  <option value="">اختر {section.label}</option>
                  {section.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {section.type === 'checkbox' && (
                <div className="flex flex-wrap gap-2">
                  {section.options.map(option => (
                    <label key={option} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.extra_fields[section.label]?.includes(option) || false}
                        onChange={(e) => {
                          const currentValues = form.extra_fields[section.label] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter(v => v !== option);
                          handleCustomSectionChange(section.id, newValues);
                        }}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn-outline" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary">
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 