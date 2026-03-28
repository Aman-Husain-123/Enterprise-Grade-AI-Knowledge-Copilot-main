'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  User, 
  Globe, 
  Bell, 
  Zap, 
  Trash2, 
  Plus, 
  RefreshCcw,
  Database,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'security' | 'system'>('api');
  const [keys, setKeys] = useState<any[]>([]);
  const [showRaw, setShowRaw] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'api') fetchKeys();
  }, [activeTab]);

  const fetchKeys = async () => {
    try {
      const { data } = await api.get('/api-keys');
      setKeys(data);
    } catch (e) {}
  };

  const createKey = async () => {
    try {
      const name = prompt('Enter a name for the new API key:');
      if (!name) return;
      const { data } = await api.post('/api-keys', { name });
      setKeys([data, ...keys]);
      setShowRaw(data.rawKey);
      toast.success('Key generated successfully');
    } catch (e) {
      toast.error('Failed to generate key');
    }
  };

  const revokeKey = async (id: string) => {
    try {
      await api.delete(`/api-keys/${id}`);
      setKeys(keys.filter(k => k.id !== id));
      toast.success('Key revoked');
    } catch (e) {
      toast.error('Revocation failed');
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1 italic">Control Center</h2>
              <p className="text-sm text-white/40 font-medium tracking-wide">Manage your enterprise keys, security protocols, and system preferences.</p>
           </div>
        </header>

        <div className="flex gap-8">
           {/* Navigation Pillar */}
           <aside className="w-64 flex flex-col gap-2">
              {[
                { id: 'profile', icon: User, label: 'Account Profile' },
                { id: 'api', icon: Key, label: 'Developer API' },
                { id: 'security', icon: Shield, label: 'Security & Auth' },
                { id: 'system', icon: SettingsIcon, label: 'System Prefs' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${
                    activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
           </aside>

           {/* Content Pillar */}
           <div className="flex-1 glass-morphism rounded-[32px] p-10 border border-white/5 shadow-2xl overflow-hidden relative min-h-[600px]">
              <AnimatePresence mode="wait">
                 {activeTab === 'api' && (
                    <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-8"
                    >
                       <div className="flex items-center justify-between">
                          <div>
                             <h3 className="text-2xl font-bold text-white mb-1">Developer API Access</h3>
                             <p className="text-xs text-white/30 font-medium uppercase tracking-widest italic">Authenticating headless requests for RAG automation</p>
                          </div>
                          <button 
                          onClick={createKey}
                          className="px-6 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                             Generate New Key
                          </button>
                       </div>

                       {showRaw && (
                         <div className="p-6 bg-emerald-500/10 border-2 border-dashed border-emerald-500/20 rounded-2xl flex flex-col gap-4 animate-in zoom-in">
                            <div className="flex items-center gap-2 text-emerald-400">
                               <CheckCircle2 className="w-4 h-4" />
                               <span className="text-xs font-bold uppercase tracking-widest">Key generated - Save it now!</span>
                            </div>
                            <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                               <code className="text-emerald-400 font-mono text-sm break-all">{showRaw}</code>
                               <button onClick={() => { navigator.clipboard.writeText(showRaw); toast.success('Copied'); }} className="text-xs font-bold text-white/30 hover:text-white transition-all uppercase px-4">Copy</button>
                            </div>
                            <p className="text-[10px] text-white/20 font-medium uppercase">This key will never be shown again for security reasons.</p>
                            <button onClick={() => setShowRaw(null)} className="text-xs font-bold text-emerald-400/60 hover:text-emerald-400 transition-all uppercase tracking-widest">Dismiss</button>
                         </div>
                       )}

                       <div className="flex flex-col gap-4">
                          {keys.map((key) => (
                             <div key={key.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center gap-6">
                                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 transition-colors group-hover:text-blue-400 group-hover:bg-blue-500/10">
                                      <Lock className="w-5 h-5" />
                                   </div>
                                   <div className="flex flex-col">
                                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{key.name}</h4>
                                      <div className="flex items-center gap-3">
                                         <p className="text-xs font-mono text-white/20">{key.keyPrefix}</p>
                                         <span className="w-1 h-1 bg-white/10 rounded-full" />
                                         <p className="text-[10px] text-white/20 font-bold uppercase">Created {new Date(key.createdAt).toLocaleDateString()}</p>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <button onClick={() => revokeKey(key.id)} className="p-2.5 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-400/10 transition-all group-hover:text-white/30">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'system' && (
                    <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-10"
                    >
                       <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Global System Preferences</h3>
                          <p className="text-xs text-white/30 font-medium uppercase tracking-widest italic">Core infrastructure and UI behavior</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-4">
                             <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">AI Foundation</h4>
                             <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/60">Primary Model Provider</label>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none cursor-pointer">
                                   <option>Claude-3-Sonnet (Default)</option>
                                   <option>GPT-4o (Vision Support)</option>
                                   <option>Gemini-1.5-Pro (Deep Research)</option>
                                </select>
                             </div>
                          </div>

                          <div className="flex flex-col gap-4">
                             <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Database Scaling</h4>
                             <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/60">Search Reranker</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                   <Database className="w-4 h-4 text-emerald-400" />
                                   <span className="text-sm text-white font-bold italic">BGE-Reranker-V2</span>
                                   <span className="ml-auto text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/10 text-amber-400">
                                <Zap className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white">Advanced Telemetry</h4>
                                <p className="text-xs text-white/30 font-medium">Capture detailed RAG tracing for every interaction.</p>
                             </div>
                          </div>
                          <button className="w-12 h-6 bg-blue-600 rounded-full relative group shadow-lg">
                             <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full group-hover:scale-110 transition-transform" />
                          </button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>

              {/* Decorative Mesh */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
