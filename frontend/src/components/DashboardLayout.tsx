'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Search, Bell, Command, User, ChevronDown } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0A0B10] min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full relative">
        <header className="flex items-center justify-between mb-8 group">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search documents or start a prompt..."
              className="w-full h-11 bg-white/5 border border-white/5 px-10 py-3 rounded-2xl text-sm placeholder:text-white/20 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium backdrop-blur-md focus:bg-white/10"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-white/10 bg-white/5 shadow-inner">
               <span className="text-[10px] font-bold text-white/30 tracking-tighter uppercase leading-none">⌘</span>
               <span className="text-[10px] font-bold text-white/30 tracking-tighter uppercase leading-none">K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5 text-white/60" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-black shadow-lg" />
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-1" />
            <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group-hover:scale-105">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden">
                <span className="text-xs font-bold text-white relative z-10">AH</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
