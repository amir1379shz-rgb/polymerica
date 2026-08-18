import React from 'react';
import useListings from '../hooks/useListings';
import ListingCard from './ListingCard.jsx';

export default function ListingList() {
  const { listings, loading, error, refresh } = useListings();

  if (loading) return <div className="p-6 text-center text-gray-600">در حال دریافت آگهی‌ها...</div>;
  if (error) return <div className="p-6 text-center text-red-600">خطا در بارگذاری آگهی‌ها.</div>;
  if (!listings || listings.length === 0) return <div className="p-6 text-center text-gray-600">هنوز آگهی‌ای ثبت نشده.</div>;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map(l => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
