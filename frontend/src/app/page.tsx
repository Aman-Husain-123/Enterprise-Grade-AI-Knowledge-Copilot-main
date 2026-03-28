'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Sparkles, 
  Database, 
  MessageCircle, 
  FileText, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const stats = [
    { label: 'Knowledge Base', value: '1,248', icon: Database, color: 'text-blue-400', sub: 'Documents indexed' },
    { label: 'AI Conversations', value: '24', icon: MessageCircle, color: 'text-purple-400', sub: 'This month' },
    { label: 'Active Workflows', value: '8', icon: LayoutGrid, color: 'text-emerald-400', sub: 'Running now' },
    { label: 'Tokens Saved', value: '1.2M', icon: BrainCircuit, color: 'text-amber-400', sub: 'vs last week' }
  ];

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400 anim-pulse" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">AI Copilot v1.0.0 Online</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            Welcome back, <span className="gradient-text">Aman</span>.
          </h2>
          <p className="text-sm text-white/40 font-medium">
            KnowledgeForge is synchronized and ready for your next instruction. 
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-morphism rounded-3xl p-5 border border-white/5 hover:bg-white/[0.07] transition-all group overflow-hidden relative"
            >
              <div className="flex flex-col gap-4 relative z-10">
                <div className={`p-2.5 rounded-2xl w-fit bg-white/5 border border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 shadow-inner" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                    <TrendingUp className="w-3 h-3 text-emerald-400 opacity-60" />
                  </div>
                  <h4 className="text-xs font-semibold text-white/30 tracking-wide uppercase mt-1">{stat.label}</h4>
                  <p className="text-[10px] text-white/20 font-medium mt-1">{stat.sub}</p>
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-24 h-24 rotate-12" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-bold text-white/80 flex items-center gap-2 tracking-wide">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Recent Activity
              </h3>
              <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-all uppercase tracking-widest">
                View All History
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { type: 'Conversation', title: 'Marketing Strategy RAG Chat', time: '12m ago', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { type: 'Document', title: 'Q3_Planning_v2.pdf added', time: '2h ago', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { type: 'Workflow', title: 'System training complete', time: '4h ago', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { type: 'Sync', title: 'Supabase vector index updated', time: 'Yesterday', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' }
              ].map((activity, idx) => (
                <div key={idx} className="glass-morphism rounded-2xl p-4 flex items-center gap-4 border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                  <div className={`p-2 rounded-xl border border-white/5 ${activity.bg} ${activity.color} group-hover:scale-110 transition-transform`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-white/90">{activity.title}</h4>
                    <p className="text-[10px] text-white/30 font-semibold tracking-wide flex items-center gap-2">
                      {activity.type} <span className="w-1 h-1 bg-white/20 rounded-full" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white/80 flex items-center gap-2 px-2 tracking-wide">
              <BrainCircuit className="w-4 h-4 text-blue-500 fill-blue-500" /> AI Insights
            </h3>
            <div className="glass-morphism rounded-3xl p-6 bg-gradient-to-br from-blue-600/10 via-[#1A1B23] to-purple-600/10 border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-white/80 italic leading-relaxed">
                      "Your knowledge base coverage in the 'Security' category has increased by 15% this week. I recommend reviewing the latest Compliance report."
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">System AI</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-bold text-white transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                      Review Insights
                    </button>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full group-hover:animate-pulse" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full group-hover:animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
