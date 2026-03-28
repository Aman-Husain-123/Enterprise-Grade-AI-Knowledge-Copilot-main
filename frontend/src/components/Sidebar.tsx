'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  MessageSquare, 
  Database, 
  Search, 
  Layers, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Workflow,
  Plus,
  Video,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/knowledge', label: 'Knowledge Base', icon: Database },
  { href: '/search', label: 'Global Search', icon: Search },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/workflows', label: 'Automations', icon: Workflow },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0A0B10] border-r border-white/5 flex flex-col p-6 h-screen sticky top-0 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-12 px-2 hover:scale-105 transition-transform duration-500 cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           <BarChart3 className="text-white w-5 h-5 relative z-10" />
        </div>
        <div>
           <h1 className="text-xl font-black text-white tracking-widest leading-none">KnowledgeForge</h1>
           <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-1 shrink-0">Enterprise AI Copilot</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                 <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-blue-400'}`} />
                 <span className="text-xs font-bold uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              {isActive && (
                 <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
        <Link 
          href="/settings"
          className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
            pathname === '/settings' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Settings</span>
        </Link>
        
        <div className="p-4 rounded-[28px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 mt-4 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">System Operational</p>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-tighter">Vector Storage (RAG)</p>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 shadow-[0_0_8px_#3B82F6]" />
                 </div>
              </div>
           </div>
           <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
              <Database className="w-20 h-20 rotate-12" />
           </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-4 text-[10px] font-bold text-white/20 hover:text-red-400 transition-colors uppercase tracking-[0.3em]">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
