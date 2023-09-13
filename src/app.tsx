import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header/header.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';

function App() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <main className="w-full h-full p-4 lg:px-8 flex-grow">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export default App;
