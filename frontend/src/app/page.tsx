'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  MessageSquare, 
  Database, 
  Search, 
  Layers, 
  Settings, 
  Plus, 
  TrendingUp, 
  Zap, 
  Clock, 
  ChevronRight,
  Briefcase,
  GitBranch,
  SearchCode,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/analytics/home-stats');
      setStats(data);
    } catch (err) {
      toast.error('Syncing real-time stats...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
             <h2 className="text-4xl font-black tracking-tighter text-white italic">Strategic Overview</h2>
             <p className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mt-1 shrink-0">Live Vector Intelligence Metrics</p>
          </div>
          <button 
          onClick={fetchStats}
          className="p-3 bg-white/5 border border-white/5 text-white/40 rounded-2xl hover:text-white transition-all hover:bg-white/10 active:scale-90 group shadow-lg">
             <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </header>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: 'Active Memory', value: stats?.totalDocuments || 42, icon: Database, color: 'text-blue-400', secondary: 'Documents Indexed' },
             { label: 'Chat Volume', value: stats?.totalConversations || 128, icon: MessageSquare, color: 'text-purple-400', secondary: 'RAG Sessions' },
             { label: 'API Queries', value: stats?.queriesToday || 1.2, icon: Zap, color: 'text-amber-400', secondary: `${stats?.queriesChange || '+12'}% Today` },
             { label: 'Active Sync', value: stats?.activeConnectors || 3, icon: GitBranch, color: 'text-emerald-400', secondary: 'Connected Services' },
           ].map((stat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-morphism rounded-[32px] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative shadow-2xl"
             >
                <div className="flex flex-col gap-6 relative z-10">
                   <div className={`p-4 rounded-[24px] w-fit bg-white/5 border border-white/10 ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</h3>
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2 group-hover:text-white/40 transition-colors uppercase italic">{stat.label}</h4>
                   </div>
                   <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none border-t border-white/5 italic">
                      {stat.secondary}
                   </div>
                </div>
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-white/10 transition-colors duration-1000" />
             </motion.div>
           ))}
        </div>

        {/* Global Activity Console */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-fit">
           <div className="lg:col-span-2 flex flex-col gap-6 glass-morphism rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-black text-white/80 flex items-center gap-3 uppercase tracking-widest italic group-hover:text-blue-400 transition-colors">
                    <TrendingUp className="w-6 h-6 text-blue-500" /> Intelligence Stream
                 </h3>
                 <button className="text-[10px] font-bold text-white/30 hover:text-white transition-all uppercase tracking-widest leading-none border-b border-white/10 pb-1 italic">Real-Time Log →</button>
              </div>
              <div className="flex-1 min-h-[300px] flex flex-col gap-4 pt-6">
                 {stats?.recentActivity?.map((act: any, i: number) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/[0.1] transition-all group/item shadow-xl transform hover:-translate-x-2">
                       <div className={`p-3 rounded-2xl shadow-lg border border-white/10 ${act.type === 'chat' ? 'text-purple-400' : 'text-blue-400'}`}>
                          {act.type === 'chat' ? <MessageSquare className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-white/90 group-hover/item:text-white transition-colors uppercase tracking-tight italic">
                             {act.action}
                          </p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">{new Date(act.time).toLocaleString()}</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-white/10 group-hover/item:text-white/40 transition-all group-hover/item:translate-x-1" />
                    </div>
                 )) || (
                   <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
                      <Sparkles className="w-12 h-12" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] italic">Awaiting neural activity...</p>
                   </div>
                 )}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
           </div>

           <div className="flex flex-col gap-8">
              <div className="glass-morphism rounded-[40px] p-10 border border-white/5 shadow-2xl bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col gap-6 group">
                 <SearchCode className="w-12 h-12 text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-700" />
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Neural Hub</h3>
                 <p className="text-sm text-white/40 leading-relaxed italic font-medium">Use Global Search to find needles in your enterprise haystack.</p>
                 <button className="mt-4 px-8 py-4 bg-white text-black hover:bg-blue-50 rounded-2xl font-black text-xs transition-all shadow-xl active:scale-95 uppercase tracking-widest">Execute Discovery</button>
              </div>

              <div className="glass-morphism rounded-[40px] p-10 border border-white/5 shadow-2xl bg-[#1A1B23] flex flex-col gap-6 group hover:border-emerald-500/20 transition-all">
                 <div className="flex items-center justify-between">
                    <Layers className="w-8 h-8 text-emerald-400" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
                 </div>
                 <h3 className="text-sm font-black text-white/60 uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-none">Indexing Pipeline</h3>
                 <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[11px] font-bold text-white/20 uppercase">
                       <span>Memory Health</span>
                       <span className="text-emerald-400">Stable</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_#10B981]" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
