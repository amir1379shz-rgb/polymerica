import React, { useState } from 'react';
import DetailModal from '../components/DetailModal.jsx';
import PostAdForm from '../components/PostAdForm.jsx';

export default function MainAppPage() {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="bg-pm-navy text-white rounded-pm p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold">پلیمریکا — بازار پلیمر و پلاستیک</h1>
              <p className="mt-2 text-sm text-pm-surface">قیمت‌ها، آگهی‌ها و ماشین‌آلات مرتبط با صنعت پلیمر؛ ثبت آگهی سریع و امن.</p>
            </div>
            <div>
              <button onClick={() => setShowForm(true)} className="inline-block px-4 py-2 bg-pm-gold text-pm-primary-900 font-semibold rounded-pm">ثبت آگهی</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">آگهی‌ها</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* ListingList will fill here automatically via hook */}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-pm w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">ثبت آگهی جدید</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500">بستن</button>
            </div>
            <div className="mt-4">
              <PostAdForm onSubmit={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      <DetailModal listing={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
