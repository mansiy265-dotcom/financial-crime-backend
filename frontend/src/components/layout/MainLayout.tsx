import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fdfbf7]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          
          <div className="relative z-10 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
