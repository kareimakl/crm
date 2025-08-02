import React, { useState, useEffect } from 'react';
import logo from '../logo.jfif';

const DEFAULT_DRIVERS = ['أحمد علي', 'سامي الحربي', 'فهد الزهراني'];
const DEFAULT_HOTEL_SUPPLIERS = ['مورد الفنادق 1', 'مورد الفنادق 2', 'مورد الفنادق 3'];
const DEFAULT_UMRAH_ITEMS = ['إزار', 'حقيبة', 'سواك', 'مظلة', 'سجادة'];
const DEFAULT_AIRLINES = ['الخطوط السعودية', 'مصر للطيران', 'طيران ناس'];
const DEFAULT_REPRESENTATIVES = ['أحمد محمد', 'سارة علي', 'خالد يوسف'];
const DEFAULT_NATIONALITIES = ['سعودي', 'مصري', 'باكستاني', 'هندي', 'أخرى'];
const DEFAULT_CHANNELS = ['إحالة', 'إنستجرام', 'واتساب', 'مباشر', 'أخرى'];

const FIXED_SERVICE_TYPES = [
  'مستلزمات عمرة',
  'طيران',
  'الحج',
  'فندق',
  'باص'
];

export default function TicketFormModal({ open, onClose, onSubmit, trip }) {
  // Supply-related state
  const [suppliesByType, setSuppliesByType] = useState({});
  const [selectedSupplies, setSelectedSupplies] = useState({});
  
  // Option state for dynamic add/delete
  const [drivers, setDrivers] = useState(DEFAULT_DRIVERS);
  const [hotelSuppliers, setHotelSuppliers] = useState(DEFAULT_HOTEL_SUPPLIERS);
  const [umrahItems, setUmrahItems] = useState(DEFAULT_UMRAH_ITEMS);
  const [airlines, setAirlines] = useState(DEFAULT_AIRLINES);
  const [representatives, setRepresentatives] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [channels, setChannels] = useState([]);

  // Inputs for adding new options
  const [newDriver, setNewDriver] = useState('');
  const [newHotel, setNewHotel] = useState('');
  const [newUmrahItem, setNewUmrahItem] = useState('');
  const [newAirline, setNewAirline] = useState('');
  const [newRep, setNewRep] = useState('');
  const [newNationality, setNewNationality] = useState('');
  const [newChannel, setNewChannel] = useState('');

  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    tripDate: trip?.tripDate || '',
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
    supply_id: null,
    service_type: '',
  });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  // Add state for local tickets
  const [localTickets, setLocalTickets] = useState([]);

  // Dynamic custom sections state
  const [customSections, setCustomSections] = useState([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    label: '',
    type: 'text', // 'text', 'dropdown', 'checkbox'
    options: []
  });
  const [newOption, setNewOption] = useState('');

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load custom sections
        const sectionsResponse = await fetch('http://localhost:4000/api/custom-sections');
        const sectionsData = await sectionsResponse.json();
        setCustomSections(sectionsData.map(section => ({
          ...section,
          options: section.options || []
        })));

        // Load nationalities
        const nationalitiesResponse = await fetch('http://localhost:4000/api/nationalities');
        const nationalitiesData = await nationalitiesResponse.json();
        setNationalities(nationalitiesData.map(item => item.name));

        // Load channels
        const channelsResponse = await fetch('http://localhost:4000/api/channels');
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.map(item => item.name));

        // Load representatives
        const representativesResponse = await fetch('http://localhost:4000/api/representatives');
        const representativesData = await representativesResponse.json();
        setRepresentatives(representativesData.map(item => item.name));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  useEffect(() => {
    if (trip) {
      setForm(f => ({ ...f, tripDate: trip.tripDate }));
    }
  }, [trip]);

  // Reset form when modal opens/closes but keep custom sections
  useEffect(() => {
    if (open) {
      // Reset form data but keep custom sections
      setForm({
        clientName: '',
        phone: '',
        tripDate: trip?.tripDate || '',
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
        supply_id: null,
        service_type: '',
      });
      setSelectedSupplies({});
      // Keep customSections as they are
    }
  }, [open, trip]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === 'checkbox' && name === 'umrahItems') {
      setForm((prev) => {
        const items = prev.umrahItems.includes(value)
          ? prev.umrahItems.filter((i) => i !== value)
          : [...prev.umrahItems, value];
        return { ...prev, umrahItems: items };
      });
    } else if (name === 'serviceType') {
      // Multi-checkbox
      // handled in the checkbox onChange below
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Load supplies when service type is selected
  const loadSuppliesForType = async (type) => {
    try {
      const response = await fetch(`http://localhost:4000/api/supplies/type/${encodeURIComponent(type)}`);
      const supplies = await response.json();
      setSuppliesByType(prev => ({
        ...prev,
        [type]: supplies
      }));
    } catch (error) {
      console.error('Error loading supplies for type:', error);
    }
  };

  // Handle service type selection
  const handleServiceTypeChange = async (type, checked) => {
    setForm(prev => ({
      ...prev,
      serviceType: checked
        ? [...prev.serviceType, type]
        : prev.serviceType.filter(t => t !== type)
    }));

    // Load supplies for newly selected type
    if (checked && !suppliesByType[type]) {
      await loadSuppliesForType(type);
    }
  };

  // Add/delete logic for each section
  const addDriver = () => {
    if (newDriver && !drivers.includes(newDriver)) {
      setDrivers([...drivers, newDriver]);
      setNewDriver('');
    }
  };
  const deleteDriver = (d) => setDrivers(drivers.filter(x => x !== d));

  const addHotel = () => {
    if (newHotel && !hotelSuppliers.includes(newHotel)) {
      setHotelSuppliers([...hotelSuppliers, newHotel]);
      setNewHotel('');
    }
  };
  const deleteHotel = (h) => setHotelSuppliers(hotelSuppliers.filter(x => x !== h));

  const addUmrahItem = () => {
    if (newUmrahItem && !umrahItems.includes(newUmrahItem)) {
      setUmrahItems([...umrahItems, newUmrahItem]);
      setNewUmrahItem('');
    }
  };
  const deleteUmrahItem = (u) => setUmrahItems(umrahItems.filter(x => x !== u));

  const addAirline = () => {
    if (newAirline && !airlines.includes(newAirline)) {
      setAirlines([...airlines, newAirline]);
      setNewAirline('');
    }
  };
  const deleteAirline = (a) => setAirlines(airlines.filter(x => x !== a));

  const addRep = async () => {
    if (newRep && !representatives.includes(newRep)) {
      try {
        const response = await fetch('http://localhost:4000/api/representatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newRep })
        });
        if (response.ok) {
          setRepresentatives([...representatives, newRep]);
          setNewRep('');
        }
      } catch (error) {
        console.error('Error adding representative:', error);
      }
    }
  };

  const deleteRep = async (repName) => {
    try {
      // Find the representative ID first
      const response = await fetch('http://localhost:4000/api/representatives');
      const representativesData = await response.json();
      const representative = representativesData.find(r => r.name === repName);
      
      if (representative) {
        const deleteResponse = await fetch(`http://localhost:4000/api/representatives/${representative.id}`, {
          method: 'DELETE'
        });
        if (deleteResponse.ok) {
          setRepresentatives(representatives.filter(x => x !== repName));
        }
      }
    } catch (error) {
      console.error('Error deleting representative:', error);
    }
  };

  const addNationality = async () => {
    if (newNationality && !nationalities.includes(newNationality)) {
      try {
        const response = await fetch('http://localhost:4000/api/nationalities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newNationality })
        });
        if (response.ok) {
          setNationalities([...nationalities, newNationality]);
          setNewNationality('');
        }
      } catch (error) {
        console.error('Error adding nationality:', error);
      }
    }
  };

  const deleteNationality = async (nationalityName) => {
    try {
      // Find the nationality ID first
      const response = await fetch('http://localhost:4000/api/nationalities');
      const nationalitiesData = await response.json();
      const nationality = nationalitiesData.find(n => n.name === nationalityName);
      
      if (nationality) {
        const deleteResponse = await fetch(`http://localhost:4000/api/nationalities/${nationality.id}`, {
          method: 'DELETE'
        });
        if (deleteResponse.ok) {
          setNationalities(nationalities.filter(x => x !== nationalityName));
        }
      }
    } catch (error) {
      console.error('Error deleting nationality:', error);
    }
  };

  const addChannel = async () => {
    if (newChannel && !channels.includes(newChannel)) {
      try {
        const response = await fetch('http://localhost:4000/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newChannel })
        });
        if (response.ok) {
          setChannels([...channels, newChannel]);
          setNewChannel('');
        }
      } catch (error) {
        console.error('Error adding channel:', error);
      }
    }
  };

  const deleteChannel = async (channelName) => {
    try {
      // Find the channel ID first
      const response = await fetch('http://localhost:4000/api/channels');
      const channelsData = await response.json();
      const channel = channelsData.find(c => c.name === channelName);
      
      if (channel) {
        const deleteResponse = await fetch(`http://localhost:4000/api/channels/${channel.id}`, {
          method: 'DELETE'
        });
        if (deleteResponse.ok) {
          setChannels(channels.filter(x => x !== channelName));
        }
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
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

  // Custom sections functions
  const handleAddSection = async () => {
    if (newSectionData.label.trim()) {
      try {
        const response = await fetch('http://localhost:4000/api/custom-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: newSectionData.label,
            type: newSectionData.type,
            options: newSectionData.options
          })
        });

        if (response.ok) {
          const savedSection = await response.json();
          setCustomSections([...customSections, {
            ...savedSection,
            options: savedSection.options || []
          }]);
          setNewSectionData({ label: '', type: 'text', options: [] });
          setShowAddSectionModal(false);
        } else {
          alert('حدث خطأ أثناء حفظ القسم المخصص');
        }
      } catch (error) {
        console.error('Error saving custom section:', error);
        alert('حدث خطأ أثناء حفظ القسم المخصص');
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/custom-sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomSections(customSections.filter(section => section.id !== sectionId));
        // Also remove from form data
        const section = customSections.find(s => s.id === sectionId);
        if (section) {
          const newExtraFields = { ...form.extra_fields };
          delete newExtraFields[section.label];
          setForm({ ...form, extra_fields: newExtraFields });
        }
      } else {
        alert('حدث خطأ أثناء حذف القسم المخصص');
      }
    } catch (error) {
      console.error('Error deleting custom section:', error);
      alert('حدث خطأ أثناء حذف القسم المخصص');
    }
  };

  const handleAddOption = () => {
    if (newOption.trim() && !newSectionData.options.includes(newOption)) {
      setNewSectionData({
        ...newSectionData,
        options: [...newSectionData.options, newOption]
      });
      setNewOption('');
    }
  };

  const handleDeleteOption = (option) => {
    setNewSectionData({
      ...newSectionData,
      options: newSectionData.options.filter(opt => opt !== option)
    });
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

  const handleAddTicket = (e) => {
    e.preventDefault();
    setLocalTickets([...localTickets, form]);
    setForm({
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
      supply_id: null,
      service_type: '',
    });
    setSelectedSupplies({});
    // Keep custom sections - don't reset them
  };

  const handleSaveAll = () => {
    onSubmit(localTickets);
    setLocalTickets([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg rtl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-xl font-bold">إضافة تذكرة جديدة</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleAddTicket} className="space-y-3">
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
            <input 
              className="input-field" 
              name="tripDate" 
              type="date" 
              value={form.tripDate} 
              onChange={handleChange} 
              required 
            />
            {trip && (
              <div className="text-xs text-blue-600 mt-1">
                تم تحديد الرحلة: {trip.tripName} - {trip.tripDate}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">نوع الخدمة</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {FIXED_SERVICE_TYPES.map(type => (
                <label key={type} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="serviceType"
                    value={type}
                    checked={form.serviceType.includes(type)}
                    onChange={e => handleServiceTypeChange(type, e.target.checked)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            {form.serviceType.length === 0 && (
              <div className="text-xs text-red-500 mt-1">يرجى اختيار نوع خدمة واحد على الأقل</div>
            )}
          </div>

          {/* Supply selection for each service type */}
          {form.serviceType.map(type => (
            <div key={type} className="border rounded-lg p-3 bg-gray-50">
              <label className="block font-medium mb-2">{type} - اختر العنصر</label>
              {suppliesByType[type] ? (
                suppliesByType[type].length > 0 ? (
                  <div className="space-y-2">
                    {suppliesByType[type].map(supply => (
                      <label key={supply.id} className="flex items-center gap-2 cursor-pointer p-2 rounded border hover:bg-white">
                        <input
                          type="radio"
                          name={`supply_${type}`}
                          value={supply.id}
                          checked={selectedSupplies[type] === supply.id}
                          onChange={() => {
                            setSelectedSupplies(prev => ({
                              ...prev,
                              [type]: supply.id
                            }));
                            setForm(prev => ({
                              ...prev,
                              supply_id: supply.id,
                              service_type: type,
                              price: supply.price
                            }));
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{supply.name}</div>
                          <div className="text-sm text-gray-600">
                            المورد: {supply.supplier} | السعر: {supply.price} ريال | الكمية المتاحة: {supply.quantity}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-orange-500">لا توجد عناصر متاحة لهذا النوع في التوريدات</div>
                )
              ) : (
                <div className="text-sm text-gray-500">جاري تحميل العناصر...</div>
              )}
            </div>
          ))}
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
                <input className="input-field flex-1" placeholder="إضافة شركة طيران" value={newAirline} onChange={e => setNewAirline(e.target.value)} />
                <button type="button" className="btn-outline" onClick={addAirline}>إضافة</button>
              </div>
              <select className="input-field" name="airline" value={form.airline} onChange={handleChange} required>
                <option value="">اختر الشركة</option>
                {airlines.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">مندوب</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {representatives.map(r => (
                <span key={r} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {r}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteRep(r)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input className="input-field flex-1" placeholder="إضافة مندوب جديد" value={newRep} onChange={e => setNewRep(e.target.value)} />
              <button type="button" className="btn-outline" onClick={addRep}>إضافة</button>
            </div>
            <select className="input-field" name="representative" value={form.representative || ''} onChange={handleChange} required>
              <option value="">اختر المندوب</option>
              {representatives.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">قناة وصول العميل للمكتب</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {channels.map(c => (
                <span key={c} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {c}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteChannel(c)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input className="input-field flex-1" placeholder="إضافة قناة جديدة" value={newChannel} onChange={e => setNewChannel(e.target.value)} />
              <button type="button" className="btn-outline" onClick={addChannel}>إضافة</button>
            </div>
            <select className="input-field" name="channel" value={form.channel} onChange={handleChange} required>
              <option value="">اختر القناة</option>
              {channels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">الهوية</label>
            <input className="input-field" name="nationalId" value={form.nationalId} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium mb-1">الجنسية</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {nationalities.map(n => (
                <span key={n} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                  {n}
                  <button type="button" className="text-red-500 text-xs" onClick={() => deleteNationality(n)}>🗑️</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input className="input-field flex-1" placeholder="إضافة جنسية جديدة" value={newNationality} onChange={e => setNewNationality(e.target.value)} />
              <button type="button" className="btn-outline" onClick={addNationality}>إضافة</button>
            </div>
            <select className="input-field" name="nationality" value={form.nationality} onChange={handleChange} required>
              <option value="">اختر الجنسية</option>
              {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">سعر التذكرة</label>
            <input className="input-field" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </div>

          {/* Custom Sections */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">أقسام مخصصة</h3>
              <button 
                type="button" 
                className="btn-outline text-sm"
                onClick={() => setShowAddSectionModal(true)}
              >
                + إضافة قسم جديد
              </button>
            </div>

            {/* Display existing custom sections */}
            {customSections.map(section => (
              <div key={section.id} className="bg-gray-50 rounded-lg p-3 mb-3 border">
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-medium">{section.label}</label>
                  <button 
                    type="button" 
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    حذف القسم
                  </button>
                </div>

                {section.type === 'text' && (
                  <input 
                    className="input-field w-full" 
                    placeholder={`أدخل ${section.label}`}
                    value={form.extra_fields[section.label] || ''}
                    onChange={(e) => handleCustomSectionChange(section.id, e.target.value)}
                  />
                )}

                {section.type === 'dropdown' && (
                  <select 
                    className="input-field w-full"
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
                              : currentValues.filter(val => val !== option);
                            handleCustomSectionChange(section.id, newValues);
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn-success w-full">إضافة</button>
          </div>
        </form>
        {localTickets.length > 0 && (
          <div className="mt-4">
            <table className="min-w-full border text-right rtl">
              <thead>
                <tr>
                  <th className="border px-2 py-1">اسم العميل</th>
                  <th className="border px-2 py-1">رقم التليفون</th>
                  <th className="border px-2 py-1">تاريخ الرحلة</th>
                  <th className="border px-2 py-1">نوع الخدمة</th>
                  <th className="border px-2 py-1">سعر التذكرة</th>
                </tr>
              </thead>
              <tbody>
                {localTickets.map((t, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{t.clientName}</td>
                    <td className="border px-2 py-1">{t.phone}</td>
                    <td className="border px-2 py-1">{t.tripDate}</td>
                    <td className="border px-2 py-1">{Array.isArray(t.serviceType) ? t.serviceType.join(', ') : t.serviceType}</td>
                    <td className="border px-2 py-1">{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-primary w-full mt-2" onClick={handleSaveAll}>حفظ الكل</button>
          </div>
        )}

        {/* Add Section Modal */}
        {showAddSectionModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md rtl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">إضافة قسم جديد</h3>
                <button 
                  className="text-gray-400 hover:text-gray-700" 
                  onClick={() => setShowAddSectionModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">اسم القسم</label>
                  <input 
                    className="input-field w-full" 
                    placeholder="مثال: نوع الغرفة"
                    value={newSectionData.label}
                    onChange={(e) => setNewSectionData({...newSectionData, label: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">نوع الحقل</label>
                  <select 
                    className="input-field w-full"
                    value={newSectionData.type}
                    onChange={(e) => setNewSectionData({...newSectionData, type: e.target.value})}
                  >
                    <option value="text">نص</option>
                    <option value="dropdown">قائمة منسدلة</option>
                    <option value="checkbox">اختيارات</option>
                  </select>
                </div>

                {(newSectionData.type === 'dropdown' || newSectionData.type === 'checkbox') && (
                  <div>
                    <label className="block font-medium mb-1">الخيارات</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        className="input-field flex-1" 
                        placeholder="إضافة خيار جديد"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      />
                      <button 
                        type="button" 
                        className="btn-outline"
                        onClick={handleAddOption}
                      >
                        إضافة
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newSectionData.options.map(option => (
                        <span key={option} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                          {option}
                          <button 
                            type="button" 
                            className="text-red-500 text-xs" 
                            onClick={() => handleDeleteOption(option)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button" 
                    className="btn-outline"
                    onClick={() => setShowAddSectionModal(false)}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleAddSection}
                  >
                    إضافة القسم
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 