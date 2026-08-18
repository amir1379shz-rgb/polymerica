import React, { useState } from 'react';
import { db } from '../lib/db';

export default function PostAdForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', price: '', qty: '', unit: 'kg', province: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const newRow = await db.insertListing({
        title: form.title,
        price: Number(form.price) || 0,
        qty: Number(form.qty) || 0,
        unit: form.unit,
        province: form.province,
        images: []
      });
      if (onSubmit) onSubmit(newRow);
    } catch (err) {
      console.error(err);
      setError('خطا در ثبت آگهی');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-pm border">
      <div>
        <label className="block text-sm font-medium">عنوان</label>
        <input value={form.title} onChange={set('title')} className="pm-input mt-1" placeholder="عنوان آگهی" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">قیمت</label>
          <input value={form.price} onChange={set('price')} className="pm-input mt-1" placeholder="قیمت به تومان" />
        </div>
        <div>
          <label className="block text-sm font-medium">مقدار</label>
          <input value={form.qty} onChange={set('qty')} className="pm-input mt-1" placeholder="مقدار" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-red-600">{error}</div>
        <button type="submit" disabled={submitting} className="pm-btn-primary px-4 py-2 rounded-pm">
          {submitting ? 'در حال ارسال...' : 'ارسال آگهی'}
        </button>
      </div>
    </form>
  );
}
