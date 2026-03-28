'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Search as SearchIcon, 
  Database, 
  Clock, 
  ExternalLink, 
  Filter, 
  Zap,
  TrendingUp,
  FileText,
  SearchCode,
  Bookmark,
  Trash2,
  Share2,
  ChevronRight,
  MoreVertical,
  Globe,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchTrending();
    fetchSaved();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data } = await api.get('/search/trending');
      setTrending(data);
    } catch (e) {}
  };

  const fetchSaved = async () => {
    try {
      const { data } = await api.get('/search/saved');
      setSaved(data);
    } catch (e) {}
  };

  const handleSearch = async (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault();
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // If Web Search is enabled, we use a slightly different meta-search approach (mocked for now, but backend ready)
      const { data } = await api.post('/search', { 
         query: searchQuery, 
         pageSize: 20,
         filters: { web_search: isWebSearch }
      });
      setResults(data.results);
      setStats({ count: data.totalCount, time: data.processingTimeMs });
    } catch (err) {
      toast.error('Search engine timeout. Retrying vectors.');
    } finally {
      setIsSearching(false);
    }
  };

  const saveSearch = async () => {
    if (!query.trim()) return;
    try {
      await api.post('/search/saved', { name: query, query });
      toast.success('Search archived');
      fetchSaved();
    } catch (e) {
      toast.error('Archive operation failed');
    }
  };

  const deleteSaved = async (id: string) => {
    try {
      await api.delete(`/search/saved/${id}`);
      setSaved(saved.filter(s => s.id !== id));
      toast.success('Deleted');
    } catch (e) {}
  };

  return (
    <DashboardLayout>
      <div className="flex gap-12">
         {/* Main Column */}
         <section className="flex-1 flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-left-4 duration-1200">
           <div className="flex flex-col gap-8 max-w-3xl text-center mx-auto pt-6">
              <div>
                 <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] italic">Knowledge Engine v2.0</div>
                 </div>
                 <h2 className="text-5xl font-black tracking-tighter text-white mb-2 uppercase leading-none italic">Vector Core Search</h2>
                 <p className="text-sm text-white/40 font-medium tracking-wide uppercase italic">Discover patterns in code, voice, and documents.</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <form 
                onSubmit={handleSearch}
                className="w-full relative group shadow-2xl">
                   <input
                     type="text"
                     placeholder="Query enterprise vectors..."
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     className="w-full h-20 bg-white/5 border border-white/10 px-16 rounded-[40px] text-xl font-bold transition-all focus:ring-4 focus:ring-blue-500/20 focus:bg-white/[0.08] group-hover:border-white/20 uppercase tracking-tighter"
                   />
                   <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-1">
                      <button 
                      type="button"
                      onClick={() => setIsWebSearch(!isWebSearch)}
                      className={`p-4 rounded-3xl transition-all flex items-center gap-2 ${isWebSearch ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-white/20 hover:text-white'}`}>
                         <Globe className={`w-5 h-5 ${isWebSearch ? 'animate-spin-slow' : ''}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none pr-1">{isWebSearch ? 'Web Enabled' : 'Deep Research'}</span>
                      </button>
                      <div className="w-px h-8 bg-white/5 mx-1" />
                      <button 
                      type="submit"
                      className="px-8 h-14 bg-white text-black hover:bg-blue-50 rounded-[28px] text-xs font-black transition-all shadow-2xl active:scale-95 uppercase tracking-[0.2em]">
                         {isSearching ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Search Now'}
                      </button>
                   </div>
                </form>
                <div className="flex items-center justify-center gap-6">
                   <button onClick={saveSearch} className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-white transition-all uppercase tracking-widest italic group">
                      <Bookmark className="w-3.5 h-3.5 group-hover:fill-white" /> Save Query
                   </button>
                   <span className="w-1 h-1 bg-white/10 rounded-full" />
                   <button className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-white transition-all uppercase tracking-widest italic">
                      <Filter className="w-3.5 h-3.5" /> Advance Filters
                   </button>
                </div>
              </div>
           </div>

           {results.length > 0 && (
              <div className="space-y-8">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black text-white/30 flex items-center gap-3 uppercase tracking-widest leading-none">
                       <Sparkles className="w-5 h-5 text-amber-500" /> Vector Synthesized Hits ({stats?.count})
                    </h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-xl">
                         Lat: {stats?.time}ms
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                       {results.map((res, i) => (
                         <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                           key={res.id}
                           className="glass-morphism rounded-[40px] p-10 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer shadow-2xl flex flex-col gap-6"
                         >
                            <div className="flex items-start justify-between gap-10">
                               <div className="flex-1 flex flex-col gap-4">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-400">
                                        <FileText className="w-4 h-4" />
                                     </div>
                                     <h4 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{res.title}</h4>
                                  </div>
                                  <p className="text-sm text-white/60 leading-relaxed italic font-medium max-w-2xl">
                                    "...{res.excerpt}..."
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                     <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/10 shadow-lg italic">
                                        {res.documentType}
                                     </div>
                                     <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 shadow-lg italic">
                                        RELEVANCE: {(res.relevanceScore * 100).toFixed(1)}%
                                     </div>
                                  </div>
                               </div>
                               <button className="p-5 rounded-3xl bg-white/5 border border-white/5 text-white/10 group-hover:text-white group-hover:bg-blue-600 transition-all shadow-2xl active:scale-95 duration-500 h-fit">
                                  <ExternalLink className="w-8 h-8" />
                               </button>
                            </div>
                            {res.highlights && (
                               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4 group-hover:border-emerald-500/30 transition-all">
                                  <Zap className="w-4 h-4 text-emerald-400" />
                                  <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest italic">{res.highlights[0]}</span>
                               </div>
                            )}
                         </motion.div>
                    ))}
                    </AnimatePresence>
                 </div>
              </div>
           )}
         </section>

         {/* Sidebar Column */}
         <aside className="w-80 flex flex-col gap-10 pt-6">
            <div className="flex flex-col gap-6">
               <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-2 italic">Discovery Archive</h3>
               <div className="flex flex-col gap-3">
                  {saved.map((s) => (
                    <div 
                    key={s.id}
                    className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-blue-600/10 hover:border-blue-500/30 transition-all cursor-pointer shadow-2xl overflow-hidden relative">
                       <div className="flex items-center gap-4 overflow-hidden relative z-10" onClick={() => { setQuery(s.query); handleSearch(undefined, s.query); }}>
                          <Bookmark className="w-5 h-5 text-blue-400 shrink-0" />
                          <span className="text-[11px] font-bold text-white/60 group-hover:text-white truncate uppercase tracking-tight italic">{s.name}</span>
                       </div>
                       <button onClick={() => deleteSaved(s.id)} className="p-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 relative z-10"><Trash2 className="w-4 h-4" /></button>
                       <div className="absolute right-0 bottom-0 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                          <Bookmark className="w-20 h-20 rotate-[30deg]" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic leading-none mb-2">Popular Quests</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Global trending insights</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {trending.map((t, i) => (
                       <button 
                       key={i}
                       onClick={() => { setQuery(t.query); handleSearch(undefined, t.query); }}
                       className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/30 hover:text-white transition-all uppercase tracking-widest">{t.query}</button>
                     ))}
                  </div>
               </div>
               <div className="absolute -right-10 -bottom-10 opacity-[0.01] group-hover:opacity-[0.05] transition-opacity duration-1000">
                  <SearchIcon className="w-64 h-64 rotate-[15deg]" />
               </div>
            </div>
         </aside>
      </div>
    </DashboardLayout>
  );
}
