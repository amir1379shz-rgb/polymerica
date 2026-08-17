import React, { Suspense, lazy } from 'react';

const FullApp = lazy(() => import('../../App.jsx'));

export default function AppWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <FullApp />
    </Suspense>
  );
}
