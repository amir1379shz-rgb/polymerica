import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-pm-navy text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo-mark.svg" alt="پلیمریکا" width="40" height="40" />
          <span className="hidden sm:inline-block font-extrabold text-lg">پلیمریکا</span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/post" className="inline-flex items-center px-4 py-2 rounded-md bg-pm-gold text-pm-primary-900 font-semibold shadow-pm-card">ثبت آگهی</a>
          <a href="/login" className="inline-flex items-center px-3 py-2 rounded-md border border-white/20">ورود / ثبت نام</a>
        </div>
      </div>
    </header>
  );
}
