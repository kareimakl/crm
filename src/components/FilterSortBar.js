import React from 'react';

export default function FilterSortBar({ types, filterType, setFilterType, sortBy, setSortBy }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow mb-2 rtl">
      <div className="flex items-center gap-2">
        <label className="font-medium">النوع:</label>
        <select
          className="input-field"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">الكل</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="font-medium">ترتيب حسب:</label>
        <select
          className="input-field"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="date_desc">التاريخ (الأحدث)</option>
          <option value="price_desc">السعر (الأعلى)</option>
          <option value="price_asc">السعر (الأقل)</option>
          <option value="quantity_desc">الكمية (الأعلى)</option>
          <option value="quantity_asc">الكمية (الأقل)</option>
        </select>
      </div>
    </div>
  );
} 