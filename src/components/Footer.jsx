import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo-mark.svg" alt="پلیمریکا" width="36" height="36" />
          <span className="font-semibold">پلیمریکا</span>
        </div>
        <div className="space-y-1">
          <div>© {new Date().getFullYear()} پلیمریکا — همهٔ حقوق محفوظ است.</div>
          <div>تماس: info@polymerica.example</div>
        </div>
      </div>
    </footer>
  );
}
