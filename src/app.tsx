import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header/header.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';

function App() {
  return (
    <div className="flex flex-col h-full w-full" style={{ '--o5ui-header-height': '58px' } as React.CSSProperties}>
      <Header />
      <main className="w-full h-full flex-grow overflow-hidden">
        <div className="overflow-auto h-full w-full p-4 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
