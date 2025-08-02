import React, { useState } from 'react';

const dummyProducts = [
  { id: 1, name: 'إحرام قطن', size: 'XL', buyPrice: 30, sellPrice: 50, quantity: 20 },
  { id: 2, name: 'حزام إحرام', size: 'M', buyPrice: 10, sellPrice: 20, quantity: 5 },
];

const Products = () => {
  const [products] = useState(dummyProducts);

  return (
    <div>
      {/* جدول المنتجات */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">اسم المنتج</th>
              <th className="table-header">المقاس</th>
              <th className="table-header">سعر الشراء</th>
              <th className="table-header">سعر البيع</th>
              <th className="table-header">الكمية</th>
              <th className="table-header">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="table-cell">{p.name}</td>
                <td className="table-cell">{p.size}</td>
                <td className="table-cell">{p.buyPrice} ر.س</td>
                <td className="table-cell">{p.sellPrice} ر.س</td>
                <td className={`table-cell ${p.quantity < 10 ? 'text-danger-600 font-bold' : ''}`}>{p.quantity}</td>
                <td className="table-cell">
                  <button className="btn-secondary ml-2">تعديل</button>
                  <button className="btn-danger">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-primary mt-6">إضافة منتج</button>
      {/* نافذة منبثقة لإضافة/تعديل منتج (placeholder) */}
    </div>
  );
};

export default Products; 