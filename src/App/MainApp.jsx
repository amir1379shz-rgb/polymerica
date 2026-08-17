import React from 'react';
import ListingList from '../components/ListingList.jsx';

export default function MainApp() {
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
              <a href="/post" className="inline-block px-4 py-2 bg-pm-gold text-pm-primary-900 font-semibold rounded-pm">ثبت آگهی</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">آگهی‌ها</h2>
        <ListingList />
      </section>
    </div>
  );
}
