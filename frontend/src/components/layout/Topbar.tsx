import React from 'react';
import { Search, Bell } from 'lucide-react';
import { formatDateTime } from '../../utils';

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-[#e6e2d8] bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 py-3">
        <form className="relative flex flex-1" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-[#8c7a6b]"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full rounded-full border border-[#e6e2d8] bg-[#fdfbf7] py-2 pl-10 pr-3 text-[#3b2b20] focus:ring-2 focus:ring-[#4a3525] sm:text-sm placeholder:text-[#8c7a6b] shadow-sm transition-shadow"
            placeholder="Search Case ID, Account, or Transaction..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="text-xs font-medium text-[#6b584b] hidden sm:block">
            Last updated: {formatDateTime(new Date().toISOString())}
          </div>
          <button type="button" className="-m-2.5 p-2.5 text-[#8c7a6b] hover:text-[#4a3525] relative transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[#d97757] ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
