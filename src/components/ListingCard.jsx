import React from 'react';

export default function ListingCard({ listing }) {
  return (
    <article className="pm-card bg-white border pm-panel p-4 rounded-pm shadow-pm-card">
      <div className="flex gap-4">
        <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          {listing.images && listing.images[0] ? (
            <img src={listing.images[0]} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">بدون تصویر</div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-pm-primary text-base">{listing.title}</h3>
            <div className="text-sm text-pm-muted">{new Intl.NumberFormat('fa-IR').format(listing.qty)} {listing.unit || 'kg'}</div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-600">{listing.province || ''} {listing.city ? `، ${listing.city}` : ''}</div>
            <div className="text-lg font-bold text-pm-primary">{new Intl.NumberFormat('fa-IR').format(listing.price)} <span className="text-sm font-medium">تومان</span></div>
          </div>
        </div>
      </div>
    </article>
  );
}
