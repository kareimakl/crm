import React, { useState } from 'react';

const STANDARD_FIELDS = [
  { name: 'name', label: 'اسم الصنف', type: 'text', required: true },
  { name: 'type', label: 'النوع', type: 'select', required: true, options: ['باص', 'طيران', 'فندق', 'أخرى'] },
  { name: 'price', label: 'السعر', type: 'number', required: true },
  { name: 'quantity', label: 'الكمية', type: 'number', required: true },
  { name: 'date', label: 'التاريخ', type: 'date', required: true },
  { name: 'supplier', label: 'تم الشراء من', type: 'text', required: false },
];

const DynamicForm = ({ initialValues = {}, onSubmit }) => {
  const [fields, setFields] = useState([...STANDARD_FIELDS]);
  const [customFields, setCustomFields] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const handleChange = (e, name) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const fieldName = `custom_${customFields.length}_${Date.now()}`;
    const newField = { name: fieldName, label: newFieldLabel, type: newFieldType };
    setCustomFields([...customFields, newField]);
    setFields([...fields, newField]);
    setNewFieldLabel('');
    setNewFieldType('text');
  };

  const handleRemoveCustomField = (name) => {
    setCustomFields(customFields.filter(f => f.name !== name));
    setFields(fields.filter(f => f.name !== name));
    const newValues = { ...values };
    delete newValues[name];
    setValues(newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(values);
  };

  return (
    <form className="space-y-4 rtl" onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="font-medium mb-1">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
          {field.type === 'select' ? (
            <select
              className="input-field"
              value={values[field.name] || ''}
              onChange={e => handleChange(e, field.name)}
              required={field.required}
            >
              <option value="">اختر النوع</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              className="input-field"
              type={field.type}
              value={values[field.name] || ''}
              onChange={e => handleChange(e, field.name)}
              required={field.required}
            />
          )}
          {field.name.startsWith('custom_') && (
            <button type="button" className="text-xs text-red-500 mt-1 self-end" onClick={() => handleRemoveCustomField(field.name)}>
              حذف الحقل
            </button>
          )}
        </div>
      ))}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium">أضف سؤال مخصص</label>
          <input
            className="input-field"
            type="text"
            placeholder="اسم الحقل الجديد"
            value={newFieldLabel}
            onChange={e => setNewFieldLabel(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">النوع</label>
          <select
            className="input-field"
            value={newFieldType}
            onChange={e => setNewFieldType(e.target.value)}
          >
            <option value="text">نص</option>
            <option value="number">رقم</option>
            <option value="date">تاريخ</option>
          </select>
        </div>
        <button type="button" className="btn-primary h-10" onClick={handleAddCustomField}>
          إضافة
        </button>
      </div>
      <button type="submit" className="btn-success w-full mt-4">حفظ</button>
    </form>
  );
};

export default DynamicForm; 