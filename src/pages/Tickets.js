import React, { useState, useMemo, useEffect } from 'react';
import TicketCard from '../components/TicketCard';
import TicketFormModal from '../components/TicketFormModal';
import TicketEditModal from '../components/TicketEditModal';
import TripCard from '../components/TripCard';
import TripFormModal from '../components/TripFormModal';
import FilterSortBar from '../components/FilterSortBar';
import * as XLSX from 'xlsx';
import { ServiceCategoryService } from '../services/serviceCategoryService';

const initialTickets = [
  {
    id: 1,
    name: 'تذكرة طيران جدة-الرياض',
    type: 'طيران',
    price: 1200,
    quantity: 10,
    date: '2024-07-01',
    client: 'أحمد علي',
    target: 'أفراد',
    delivery: true,
    return_policy: 'غير قابلة للاسترجاع',
  },
  {
    id: 2,
    name: 'تذكرة فندق خمس نجوم',
    type: 'فندق',
    price: 800,
    quantity: 5,
    date: '2024-07-10',
    client: 'شركة السياحة',
    target: 'شركات',
    delivery: false,
    return_policy: 'قابلة للاسترجاع خلال 24 ساعة',
  },
];

const initialTrips = [
  {
    id: 1,
    tripType: 'bus',
    supplier: 'شركة النقل المقدس',
    tripName: 'رحلة نقل الحجاج',
    tripDate: '2024-07-15',
    notes: 'نقل مجموعة من 30 حاج من الرياض إلى مكة',
    createdAt: '2024-06-01T10:00:00Z'
  },
  {
    id: 2,
    tripType: 'hotel',
    supplier: 'فندق مكة المكرمة',
    tripName: 'إقامة العمرة',
    tripDate: '2024-08-20',
    notes: 'إقامة لمدة 5 أيام لمجموعة من 15 معتمر',
    createdAt: '2024-06-02T14:30:00Z'
  }
];

const DEFAULT_BUS_COLUMNS = [
  'اسم السائقين',
  'أرقام التليفون',
  'اسم الباص',
  'رقم الباص',
  'لوحة الباص',
  'كود الباص',
];

const PILGRIM_COLUMNS = [
  'الاسم الثلاثي',
  'الجنسية',
  'رقم الإقامة أو الجواز',
  'رقم الجوال',
];

// TripAddModal has been replaced with TripFormModal

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showTicketEditModal, setShowTicketEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showTripAddModal, setShowTripAddModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [categories, setCategories] = useState([]);
  const [showAddType, setShowAddType] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const tripsRes = await fetch('http://localhost:4000/api/trips');
      let tripsData = await tripsRes.json();
      if (!Array.isArray(tripsData)) tripsData = [];
      setTrips(tripsData);
      const ticketsRes = await fetch('http://localhost:4000/api/tickets');
      let ticketsData = await ticketsRes.json();
      if (!Array.isArray(ticketsData)) ticketsData = [];
      setTickets(ticketsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    ServiceCategoryService.ensureDefaultCategories();
    const unsub = ServiceCategoryService.subscribe(setCategories);
    return () => unsub();
  }, []);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    let list = [...tickets];
    if (filterType) list = list.filter(s => s.type === filterType);
    switch (sortBy) {
      case 'date_desc':
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'quantity_desc':
        list.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'quantity_asc':
        list.sort((a, b) => a.quantity - b.quantity);
        break;
      default:
        break;
    }
    return list;
  }, [tickets, filterType, sortBy]);

  // Add new ticket
  const handleAddTicket = async (data) => {
    // Support both single ticket (object) and multiple tickets (array)
    const ticketsToAdd = Array.isArray(data) ? data : [data];
    
    try {
      // Send each ticket to backend
      for (const t of ticketsToAdd) {
        const type = Array.isArray(t.serviceType) ? t.serviceType.join(', ') : t.serviceType;
        const ticketData = {
          trip_id: selectedTrip ? selectedTrip.id : null,
          name: `تذكرة ${type}${t.clientName ? ' - ' + t.clientName : ''}`,
          type: type,
          price: t.price || 0,
          quantity: 1,
          date: selectedTrip ? selectedTrip.tripDate : t.tripDate,
          client: t.clientName,
          phone: t.phone,
          target: t.target || '',
          delivery: t.delivery || false,
          return_policy: t.return_policy || '',
          supply_id: t.supply_id,
          service_type: t.service_type,
        };
        
        await fetch('http://localhost:4000/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData)
        });
      }
      
      // Refresh tickets from backend
      const res = await fetch('http://localhost:4000/api/tickets');
      let newData = await res.json();
      if (!Array.isArray(newData)) newData = [];
      setTickets(newData);
      
    setShowTicketModal(false);
      setSelectedTrip(null);
      
      // Add new types if needed
      ticketsToAdd.forEach(ticket => {
        const type = Array.isArray(ticket.serviceType) ? ticket.serviceType.join(', ') : ticket.serviceType;
    if (type && !categories.some(c => c.name === type)) {
      ServiceCategoryService.addCategory({ name: type });
        }
      });
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('حدث خطأ أثناء إضافة التذكرة');
    }
  };

  // Add new trip
  const handleAddTrip = async (trip) => {
    await fetch('http://localhost:4000/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_type: trip.tripType || '',
        supplier: trip.supplier || '',
        trip_name: trip.tripName,
        trip_date: trip.tripDate,
        notes: trip.notes || '',
        created_at: new Date().toISOString(),
        driver_name: trip.driverName || '',
        assistant_driver: trip.assistantDriver || '',
        trip_number: trip.tripNumber || '',
        bus_number: trip.busNumber || '',
        extra_fields: trip.extra_fields || {}
      })
    });
    // Refresh trips from backend
    const tripsRes = await fetch('http://localhost:4000/api/trips');
    let tripsData = await tripsRes.json();
    if (!Array.isArray(tripsData)) tripsData = [];
    setTrips(tripsData);
  };

  // Edit handler for tickets
  const handleEdit = async (id, updatedData) => {
    try {
      const ticketData = {
        name: `تذكرة ${updatedData.serviceType}${updatedData.clientName ? ' - ' + updatedData.clientName : ''}`,
        type: updatedData.serviceType,
        price: updatedData.price || 0,
        quantity: 1,
        date: updatedData.tripDate,
        client: updatedData.clientName,
        phone: updatedData.phone,
        target: updatedData.target || '',
        delivery: updatedData.delivery || false,
        return_policy: updatedData.return_policy || '',
      };

      const response = await fetch(`http://localhost:4000/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        // Refresh tickets from backend
        const res = await fetch('http://localhost:4000/api/tickets');
        let newData = await res.json();
        if (!Array.isArray(newData)) newData = [];
        setTickets(newData);
      } else {
        alert('حدث خطأ أثناء تحديث التذكرة');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('حدث خطأ أثناء تحديث التذكرة');
    }
  };

  const handleEditClick = (id, ticket) => {
    setEditingTicket(ticket);
    setShowTicketEditModal(true);
  };
  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/api/tickets/${id}`, { method: 'DELETE' });
    // Refresh tickets from backend
    const res = await fetch('http://localhost:4000/api/tickets');
    let newData = await res.json();
    if (!Array.isArray(newData)) newData = [];
    setTickets(newData);
  };

  // Delete handler for trips
  const handleDeleteTrip = async (id) => {
    await fetch(`http://localhost:4000/api/trips/${id}`, { method: 'DELETE' });
    // Refresh trips from backend
    const tripsRes = await fetch('http://localhost:4000/api/trips');
    let tripsData = await tripsRes.json();
    if (!Array.isArray(tripsData)) tripsData = [];
    setTrips(tripsData);
  };

  // Add new type
  const handleAddType = () => {
    if (showAddType) {
      setShowAddType(false);
    }
  };

  // Add this function inside the Tickets component
  function handleExportExcel(trip) {
    // Get all tickets for this trip
    const tripTickets = tickets.filter(t => t.tripId === trip.id);

    // If no tickets, show a warning and do not export
    if (tripTickets.length === 0) {
      alert('لا توجد تذاكر لهذه الرحلة');
      return;
    }

    // Define columns (headers)
    const baseHeaders = [
      'اسم العميل',
      'رقم التليفون',
      'تاريخ الرحلة',
      'نوع الخدمة',
      'سعر التذكرة',
      'الجنسية',
      'الهوية',
      'مندوب',
      'قناة الوصول'
    ];

    // Collect all extra field keys from tickets
    const extraKeys = Array.from(new Set(tripTickets.flatMap(t => t.extra_fields ? Object.keys(t.extra_fields) : [])));
    const headers = [...baseHeaders, ...extraKeys];

    // Build data rows (reversed for RTL)
    const rows = tripTickets.map(t => [
      t.client || '',
      t.phone || '',
      t.date || '',
      t.type || '',
      t.price || '',
      t.nationality || '',
      t.nationalId || '',
      t.representative || '',
      t.channel || '',
      ...extraKeys.map(k => (t.extra_fields && t.extra_fields[k]) ? t.extra_fields[k] : '')
    ].reverse());

    // Prepend trip info rows (reversed for RTL)
    const tripInfoRows = [
      [
        'رقم الباص', trip.busNumber || '',
        'رقم الرحلة', trip.tripNumber || '',
        'مساعد السائق', trip.assistantDriver || '',
        'اسم السائق', trip.driverName || ''
      ].reverse(),
      [
        'ملاحظات', trip.notes || '',
        'المورد', trip.supplier || '',
        'تاريخ الرحلة', trip.tripDate || '',
        'اسم الرحلة', trip.tripName || ''
      ].reverse(),
      Array(headers.length).fill('==============='), // separator row
    ];

    // Worksheet data: trip info rows + header row + data rows (all reversed)
    const wsData = [
      ...tripInfoRows,
      headers.slice().reverse(),
      ...rows
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Style: bold headers, borders, column widths
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: tripInfoRows.length, c: C })];
      if (cell) {
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
        };
      }
    }
    // Set borders for all data cells
    for (let R = tripInfoRows.length + 1; R < wsData.length; ++R) {
      for (let C = 0; C < headers.length; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          cell.s = {
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
          };
        }
      }
    }
    // Set column widths
    ws['!cols'] = headers.map(h => ({ wch: Math.max(12, h.length + 4) }));
    // RTL direction
    ws['!dir'] = 'rtl';

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تذاكر الرحلة');
    XLSX.writeFile(wb, `تذاكر_${trip.tripName || 'رحلة'}.xlsx`);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">التذاكر</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTicketModal(true)}
              className="btn-primary"
            >
              إضافة تذكرة
            </button>
            <button
              onClick={() => setShowTripAddModal(true)}
              className="btn-outline"
            >
              إضافة رحلة
            </button>
          </div>
        </div>

        {/* رحلات Section */}
        {trips.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">الرحلات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onAddTicket={() => { setSelectedTrip(trip); setShowTicketModal(true); }}
                  onExportExcel={() => handleExportExcel(trip)}
                  onDelete={() => handleDeleteTrip(trip.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filter bar as boxes (now below header) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-lg shadow text-sm font-bold transition border ${filterType === cat.name ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
              onClick={() => setFilterType(cat.name === filterType ? '' : cat.name)}
            >
              {cat.name}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-lg shadow text-sm font-bold bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
            onClick={() => setShowAddType(true)}
          >
            + إضافة خدمة
          </button>
        </div>

        {/* Add new type modal */}
        {showAddType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rtl">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">إضافة نوع خدمة جديد</h2>
                <button className="text-gray-400 hover:text-gray-700" onClick={() => setShowAddType(false)}>✕</button>
              </div>
              <input
                className="input-field w-full mb-4"
                placeholder="اسم الخدمة الجديدة"
                value={showAddType}
                onChange={e => setShowAddType(e.target.value)}
              />
              <button className="btn-success w-full" onClick={handleAddType}>إضافة</button>
            </div>
          </div>
        )}

        <FilterSortBar
          types={categories.map(cat => cat.name)}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">لا توجد تذاكر</div>
          ) : (
            filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <TripFormModal
          open={showTripAddModal}
          onClose={() => setShowTripAddModal(false)}
          onSubmit={handleAddTrip}
        />
      </div>

      {/* Modals */}
      <TicketFormModal
        open={showTicketModal}
        onClose={() => { setShowTicketModal(false); setSelectedTrip(null); }}
        onSubmit={handleAddTicket}
        trip={selectedTrip}
      />
      <TicketEditModal
        open={showTicketEditModal}
        onClose={() => {
          setShowTicketEditModal(false);
          setEditingTicket(null);
        }}
        onSubmit={handleEdit}
        ticket={editingTicket}
        existingTypes={categories.map(cat => cat.name)}
      />
    </div>
  );
} 