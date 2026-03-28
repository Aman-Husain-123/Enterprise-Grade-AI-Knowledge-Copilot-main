'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Plus, 
  Play, 
  Settings, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Zap, 
  MoreVertical,
  Layers,
  Sparkles,
  RefreshCcw,
  Database,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/workflows');
      setWorkflows(data);
    } catch (e) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const runWorkflow = async (id: string) => {
    try {
      toast.loading('Starting Execution...', { id: 'run' });
      const { data } = await api.post(`/workflows/${id}/run`);
      toast.success(`Run successful: ${data.status}`, { id: 'run' });
      fetchWorkflows(); // Refresh last run time
    } catch (err) {
      toast.error('Workflow execution failed', { id: 'run' });
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Autonomous Workflows</h2>
              <p className="text-sm text-white/40 font-medium tracking-wide">Orchestrate RAG pipelines and AI-driven automation on a scheduled basis.</p>
           </div>
           <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Create Model
           </button>
        </header>

        <div className="flex gap-4 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
           {['active', 'paused', 'completed'].map((status) => (
             <button key={status} className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all first:bg-white/10 first:text-white">
                {status}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
              {workflows.map((wf, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={wf.id}
                  className="glass-morphism rounded-[32px] p-8 border border-white/5 hover:bg-white/5 transition-all group overflow-hidden flex flex-col gap-6 shadow-2xl relative"
                >
                   <div className="flex items-start justify-between relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                         <Layers className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                           wf.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/10'
                         }`}>
                           {wf.status}
                         </span>
                         <button className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
                            <MoreVertical className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="relative z-10">
                      <h4 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{wf.name}</h4>
                      <p className="text-sm text-white/40 leading-relaxed italic font-medium">
                        {wf.description || 'No description provided.'}
                      </p>
                   </div>

                   <div className="flex items-center gap-6 relative z-10">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Executions</span>
                         <span className="text-sm font-bold text-white">{wf.run_count || 0}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Interval</span>
                         <span className="text-sm font-bold text-white uppercase">{wf.trigger_type}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Last Run</span>
                         <span className="text-sm font-bold text-white">{wf.last_run_at ? new Date(wf.last_run_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 relative z-10">
                      <div className="flex items-center gap-2">
                         <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/30 hover:text-white transition-all shadow-lg active:scale-90">
                            <Settings className="w-5 h-5" />
                         </button>
                         <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/30 hover:text-white transition-all shadow-lg active:scale-90">
                            <RefreshCcw className="w-5 h-5" />
                         </button>
                      </div>
                      <button 
                      onClick={() => runWorkflow(wf.id)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 shadow-blue-600/10">
                         <Play className="w-4 h-4 fill-white" /> Execute Now
                      </button>
                   </div>
                   
                   <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                      <Layers className="w-40 h-40 rotate-[15deg]" />
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
           
           <div className="border-2 border-dashed border-white/5 rounded-[32px] p-10 flex flex-col items-center justify-center gap-6 hover:border-blue-500/20 hover:bg-blue-600/[0.02] transition-all cursor-pointer group min-h-[300px]">
              <div className="p-6 rounded-full bg-white/5 text-white/10 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-700">
                 <Plus className="w-10 h-10" />
              </div>
              <div className="text-center">
                 <h4 className="text-lg font-bold text-white/20 group-hover:text-white/60 transition-all">Define New Workflow</h4>
                 <p className="text-xs text-white/10 font-medium mt-1 uppercase tracking-widest italic group-hover:text-white/30">Connect Data Source → Build Index → Trigger AI</p>
              </div>
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
