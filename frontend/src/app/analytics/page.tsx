'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Database, 
  Zap, 
  Clock, 
  AlertCircle, 
  MousePointer2,
  Cpu,
  BrainCircuit,
  Settings as SettingsIcon,
  Filter,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/analytics/dashboard');
        setData(data);
      } catch (err) {
        toast.error('Failed to load analytics dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <DashboardLayout><div className="flex h-screen items-center justify-center opacity-20"><Loader2 className="w-10 h-10 animate-spin" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Intelligence Analytics</h2>
              <p className="text-sm text-white/40 font-medium tracking-wide">Monitor token consumption, RAG accuracy, and system health.</p>
           </div>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs font-bold hover:text-white transition-all flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> Last 30 Days
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95">
                 Export Report
              </button>
           </div>
        </header>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Inferences', value: data.usage.totalQueries, change: data.usage.queriesChange, icon: Cpu, color: 'text-blue-400' },
             { label: 'Avg Latency', value: `${data.aiPerformance.avgLatencyMs}ms`, change: -2.4, icon: Clock, color: 'text-purple-400' },
             { label: 'Knowledge Coverage', value: `${(data.knowledge.coverageScore * 100).toFixed(1)}%`, change: +5.2, icon: Database, color: 'text-emerald-400' },
             { label: 'Citation Accuracy', value: `${(data.aiPerformance.citationAccuracy * 100).toFixed(0)}%`, change: +0.4, icon: BrainCircuit, color: 'text-amber-400' }
           ].map((stat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-morphism rounded-3xl p-6 border border-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative shadow-xl"
             >
                <div className="flex flex-col gap-4 relative z-10">
                   <div className={`p-2.5 rounded-2xl w-fit bg-white/5 border border-white/10 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                         <span className={`text-[10px] font-bold ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                           {stat.change >= 0 ? '+' : ''}{stat.change}%
                         </span>
                      </div>
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{stat.label}</h4>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-morphism rounded-[32px] p-8 border border-white/5 shadow-2xll">
              <div className="flex items-center justify-between mb-8 px-2">
                 <h3 className="text-base font-bold text-white/80 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> Query Volume (RAG Sessions)
                 </h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Queries</span>
                    </div>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.usage.queryVolume}>
                       <defs>
                          <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                       <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} 
                        dy={10}
                       />
                       <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} 
                       />
                       <Tooltip 
                        contentStyle={{ background: '#1A1B23', border: '1px solid #2D2E3A', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                       />
                       <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorQueries)" 
                        animationDuration={1500}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-morphism rounded-[32px] p-8 border border-white/5 shadow-2xl">
              <h3 className="text-base font-bold text-white/80 flex items-center gap-2 mb-8 px-2 uppercase tracking-widest">
                 <BarChart3 className="w-4 h-4 text-purple-500" /> Model Distribution
              </h3>
              <div className="h-[300px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={data.usage.topModels}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="queryCount"
                          nameKey="model"
                       >
                          {data.usage.topModels.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip 
                        contentStyle={{ background: '#1A1B23', border: '1px solid #2D2E3A', borderRadius: '12px' }}
                       />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">4</span>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Models</p>
                 </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                 {data.usage.topModels.map((m: any, idx: number) => (
                   <div key={idx} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                         <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-tight">{m.model}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/30">{m.percentage}%</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Latency and Accuracy Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-morphism rounded-[32px] p-8 border border-white/5 shadow-2xl">
              <h3 className="text-base font-bold text-white/80 flex items-center gap-2 mb-8 px-2 uppercase tracking-widest">
                 <Zap className="w-4 h-4 text-amber-500" /> Latency Pipeline (TTFT)
              </h3>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.aiPerformance.latencyTrend}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="date" hide />
                       <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} 
                        unit="ms"
                       />
                       <Tooltip 
                        contentStyle={{ background: '#1A1B23', border: '1px solid #2D2E3A', borderRadius: '12px' }}
                       />
                       <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {data.aiPerformance.latencyTrend.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill="#F59E0B" fillOpacity={index === data.aiPerformance.latencyTrend.length - 1 ? 1 : 0.4} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-morphism rounded-[32px] p-8 border border-white/5 shadow-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5">
              <h3 className="text-base font-bold text-white/80 flex items-center gap-2 mb-6 px-2 uppercase tracking-widest">
                 <AlertCircle className="w-4 h-4 text-emerald-400" /> Error Rate & Uptime
              </h3>
              <div className="flex flex-col gap-6 pt-4">
                 {[
                   { label: 'System Uptime', value: '99.99%', color: 'bg-emerald-500' },
                   { label: 'Embedding Latency', value: '42ms', color: 'bg-blue-500' },
                   { label: 'Database Index Sync', value: 'Healthy', color: 'bg-emerald-500' },
                   { label: 'Token Utilization', value: '62%', color: 'bg-amber-500' }
                 ].map((stat, i) => (
                   <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white/50">{stat.label}</span>
                        <span className="text-xs font-black text-white">{stat.value}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.value.includes('%') ? stat.value : '100%' }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
