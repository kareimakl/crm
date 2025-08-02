import React, { useState, useEffect } from 'react';

const SERVICE_TYPES = [
  { id: 'bus', label: 'باص', icon: '🚌' },
  { id: 'hotel', label: 'فندق', icon: '🏨' },
  { id: 'flight', label: 'طيران', icon: '✈️' },
];

const SUPPLIER_OPTIONS = {
  bus: [
    'شركة النقل المقدس',
    'شركة الباصات المتحدة',
    'شركة النقل السعودي',
    'شركة الحج والعمرة للنقل'
  ],
  hotel: [
    'فندق مكة المكرمة',
    'فندق المدينة المنورة',
    'فندق دار الإيمان',
    'فندق البيت العتيق',
    'فندق دار السلام'
  ],
  umrah: [
    'متجر الإحرام الأصيل',
    'شركة مستلزمات العمرة',
    'متجر الحرمين',
    'شركة التجهيزات الدينية'
  ],
  flight: [
    'الخطوط الجوية السعودية',
    'طيران الإمارات',
    'الخطوط الجوية القطرية',
    'طيران الخليج',
    'الخطوط الجوية الكويتية'
  ]
};

export default function TripFormModal({ open, onClose, onSubmit }) {
  const [tripData, setTripData] = useState({
    tripType: '',
    supplier: '',
    tripName: '',
    tripDate: '',
    notes: '',
    extra_fields: {}
  });

  const [customSections, setCustomSections] = useState([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    label: '',
    type: 'text',
    options: []
  });
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (open) {
      loadCustomSections();
    }
  }, [open]);

  const loadCustomSections = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/trip-custom-sections');
      if (response.ok) {
        const sections = await response.json();
        setCustomSections(sections);
      }
    } catch (error) {
      console.error('Error loading custom sections:', error);
    }
  };

  const handleChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomSectionChange = (sectionId, value) => {
    const section = customSections.find(s => s.id === sectionId);
    if (section) {
      setTripData(prev => ({
        ...prev,
        extra_fields: { ...prev.extra_fields, [section.label]: value }
      }));
    }
  };

  const handleAddSection = async () => {
    if (!newSectionData.label.trim()) {
      alert('يرجى إدخال اسم القسم');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/trip-custom-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSectionData)
      });

      if (response.ok) {
        const newSection = await response.json();
        setCustomSections([...customSections, newSection]);
        setNewSectionData({ label: '', type: 'text', options: [] });
        setShowAddSectionModal(false);
      } else {
        alert('حدث خطأ أثناء إضافة القسم المخصص');
      }
    } catch (error) {
      console.error('Error adding custom section:', error);
      alert('حدث خطأ أثناء إضافة القسم المخصص');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/trip-custom-sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomSections(customSections.filter(section => section.id !== sectionId));
        // Also remove from form data
        const section = customSections.find(s => s.id === sectionId);
        if (section) {
          const newExtraFields = { ...tripData.extra_fields };
          delete newExtraFields[section.label];
          setTripData(prev => ({ ...prev, extra_fields: newExtraFields }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tripData.tripType && tripData.supplier) {
      onSubmit({
        ...tripData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      setTripData({
        tripType: '',
        supplier: '',
        tripName: '',
        tripDate: '',
        notes: '',
        extra_fields: {}
      });
      onClose();
    }
  };

  const getSupplierLabel = (tripType) => {
    const labels = {
      bus: 'مورد الباص',
      hotel: 'مورد الفندق',
      umrah: 'مورد المستلزمات',
      flight: 'شركة الطيران'
    };
    return labels[tripType] || 'المورد';
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rtl">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">إضافة رحلة جديدة</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trip Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الرحلة <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={tripData.tripType}
                onChange={(e) => handleChange('tripType', e.target.value)}
                required
              >
                <option value="">اختر نوع الرحلة</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Supplier Field */}
            {tripData.tripType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getSupplierLabel(tripData.tripType)} <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={tripData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  required
                >
                  <option value="">اختر {getSupplierLabel(tripData.tripType)}</option>
                  {SUPPLIER_OPTIONS[tripData.tripType]?.map(supplier => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Trip Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الرحلة
              </label>
              <input
                type="text"
                className="input-field"
                value={tripData.tripName}
                onChange={(e) => handleChange('tripName', e.target.value)}
                placeholder="مثال: رحلة العمرة الشتوية"
              />
            </div>

            {/* Trip Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الرحلة
              </label>
              <input
                type="date"
                className="input-field"
                value={tripData.tripDate}
                onChange={(e) => handleChange('tripDate', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات الرحلة
              </label>
              <textarea
                className="input-field"
                rows="3"
                value={tripData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="أي ملاحظات إضافية حول الرحلة..."
              />
            </div>

            {/* Custom Sections */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  الأقسام المخصصة
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + إضافة قسم جديد
                </button>
              </div>
              
              {customSections.map(section => (
                <div key={section.id} className="mb-3 p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {section.label}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                  
                  {section.type === 'text' && (
                    <input
                      type="text"
                      className="input-field"
                      value={tripData.extra_fields[section.label] || ''}
                      onChange={(e) => handleCustomSectionChange(section.id, e.target.value)}
                      placeholder={`أدخل ${section.label}`}
                    />
                  )}
                  
                  {section.type === 'dropdown' && (
                    <select
                      className="input-field"
                      value={tripData.extra_fields[section.label] || ''}
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
                            checked={tripData.extra_fields[section.label]?.includes(option) || false}
                            onChange={(e) => {
                              const currentValues = tripData.extra_fields[section.label] || [];
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
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!tripData.tripType || !tripData.supplier}
              >
                إضافة الرحلة
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Custom Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 rtl">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">إضافة قسم مخصص جديد</h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم القسم</label>
                <input
                  type="text"
                  className="input-field"
                  value={newSectionData.label}
                  onChange={(e) => setNewSectionData({...newSectionData, label: e.target.value})}
                  placeholder="مثال: نوع الباص"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">نوع القسم</label>
                <select
                  className="input-field"
                  value={newSectionData.type}
                  onChange={(e) => setNewSectionData({...newSectionData, type: e.target.value})}
                >
                  <option value="text">نص</option>
                  <option value="dropdown">قائمة منسدلة</option>
                  <option value="checkbox">خانات اختيار</option>
                </select>
              </div>
              
              {(newSectionData.type === 'dropdown' || newSectionData.type === 'checkbox') && (
                <div>
                  <label className="block text-sm font-medium mb-1">الخيارات</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="إضافة خيار جديد"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="btn-outline"
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
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="btn-outline"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="btn-primary"
                >
                  إضافة القسم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 