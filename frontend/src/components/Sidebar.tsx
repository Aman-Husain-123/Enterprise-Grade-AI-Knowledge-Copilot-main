'use client';

import React from 'react';
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Search, 
  Settings, 
  LogOut, 
  Plus, 
  Globe, 
  Star,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'AI Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Knowledge Base', icon: BookOpen, path: '/knowledge' },
    { name: 'Global Search', icon: Search, path: '/search' },
    { name: 'Workflows', icon: Globe, path: '/workflows' },
  ];

  return (
    <aside className="w-64 glass-morphism h-screen sticky top-0 border-r border-white items-stretch flex flex-col p-4 z-50">
      <div className="mb-10 px-2 group cursor-pointer transition-all">
        <h1 className="text-2xl font-bold gradient-text tracking-tight group-hover:scale-105 duration-300">
          KnowledgeForge
        </h1>
        <p className="text-[10px] text-white/40 font-medium uppercase tracking-[0.2em] mt-1">
          Enterprise AI Copilot
        </p>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              pathname === item.path 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 ${pathname === item.path ? 'text-blue-400' : 'group-hover:scale-110 duration-200'}`} />
            <span className="font-medium text-sm tracking-wide">{item.name}</span>
            {item.name === 'AI Chat' && (
              <span className="ml-auto inline-flex items-center rounded-md bg-blue-900/30 px-1.5 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-700/30 anim-pulse">
                New
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <div className="glass-morphism rounded-2xl p-4 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-white/90">Forge Pro Plan</h4>
            <p className="text-[10px] text-white/50 leading-relaxed max-w-[140px]">
              Unlimited RAG processing and context.
            </p>
            <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 transition-all">
              Upgrade Now <Star className="w-2.5 h-2.5 fill-blue-400" />
            </button>
          </div>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Plus className="w-8 h-8 text-blue-400 rotate-45" />
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group duration-300">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 duration-300" />
          <span className="font-medium text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
};
