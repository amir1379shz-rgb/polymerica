import React from 'react';

export default function DetailModal({ open, onClose, item }) {
  if (!open) return null;

  return (
    <div className="pm-modal-backdrop fixed inset-0 flex items-center justify-center z-50">
      <div className="pm-modal bg-white p-4 rounded-pm max-w-lg w-full shadow-lg">
        <header className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{item?.title || 'جزئیات آگهی'}</h3>
          <button onClick={onClose} aria-label="بستن" className="pm-btn-ghost">
            ×
          </button>
        </header>

        <div className="space-y-2 text-sm">
          <div><strong>قیمت:</strong> {item?.price ?? '-'} تومان</div>
          <div><strong>مقدار:</strong> {item?.qty ?? '-'} {item?.unit || ''}</div>
          <div><strong>استان:</strong> {item?.province ?? '-'}</div>

          {item?.images && item.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {item.images.map((src, i) => (
                <img key={i} src={src} alt={`image-${i}`} className="w-full h-24 object-cover rounded-sm" />
              ))}
            </div>
          )}

          {item?.description && (
            <div className="mt-2">
              <strong>توضیحات:</strong>
              <p className="mt-1 text-sm text-gray-700">{item.description}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="pm-btn-primary px-4 py-2 rounded-pm">
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
