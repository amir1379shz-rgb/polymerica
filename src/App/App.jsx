import React, { Suspense, lazy } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MainApp = lazy(() => import('./MainApp.jsx'));

export default function AppWrapper() {
  return (
    <div className="min-h-screen flex flex-col bg-pm-cream text-pm-primary">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
          <MainApp />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
