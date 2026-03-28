'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Search, 
  Database, 
  Clock, 
  ExternalLink, 
  Filter, 
  Zap,
  TrendingUp,
  FileText,
  SearchCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data } = await api.get('/search/trending');
      setTrending(data);
    } catch (e) {}
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await api.post('/search', { query, pageSize: 20 });
      setResults(data.results);
      setStats({ count: data.totalCount, time: data.processingTimeMs });
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto pt-10">
           <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center border border-white/5 shadow-2xl">
              <SearchCode className="w-8 h-8 text-blue-400 anim-pulse" />
           </div>
           <div>
              <h2 className="text-4xl font-bold tracking-tight text-white mb-2 italic">Global Vector Search</h2>
              <p className="text-sm text-white/40 font-medium tracking-wide">
                 Query across all your connected documents, codebases, and conversations.
              </p>
           </div>
           
           <form 
           onSubmit={handleSearch}
           className="w-full relative group">
              <input
                type="text"
                autoFocus
                placeholder="Ask or search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-16 bg-white/5 border border-white/10 px-14 rounded-[28px] text-lg font-medium transition-all focus:ring-2 focus:ring-blue-500/30 focus:bg-white/[0.08] shadow-2xl group-hover:border-white/20"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
              <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95">
                 {isSearching ? 'Analyzing...' : 'Execute Search'}
              </button>
           </form>

           <div className="flex flex-wrap items-center justify-center gap-3">
              {trending.map((t, i) => (
                <button 
                key={i}
                onClick={() => { setQuery(t.query); handleSearch(); }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/30 hover:text-blue-400 hover:bg-white/10 hover:border-blue-500/20 transition-all flex items-center gap-2">
                   <TrendingUp className="w-3 h-3" /> {t.query}
                </button>
              ))}
           </div>
        </div>

        {results.length > 0 && (
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-bold text-white/30 flex items-center gap-2 uppercase tracking-widest leading-none">
                    <Zap className="w-4 h-4 text-amber-500" /> Discoveries Found ({stats?.count})
                 </h3>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   Processed in {stats?.time}ms
                 </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <AnimatePresence mode="popLayout">
                    {results.map((res, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={res.id}
                        className="glass-morphism rounded-3xl p-6 border border-white/5 hover:bg-white/5 transition-all group cursor-pointer border border-white/5 shadow-xl"
                      >
                         <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 flex flex-col gap-2">
                               <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{res.title}</h4>
                               <p className="text-sm text-white/50 leading-relaxed line-clamp-2 italic font-medium">
                                 "...{res.excerpt}..."
                               </p>
                               <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest border border-blue-500/10">
                                     <FileText className="w-2.5 h-2.5" /> {res.documentType}
                                  </div>
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-white/30 text-[9px] font-bold uppercase tracking-widest border border-white/5">
                                     <TrendingUp className="w-2.5 h-2.5" /> Score: {(res.relevanceScore * 100).toFixed(1)}%
                                  </div>
                                  <span className="text-[10px] text-white/20 font-medium">Indexed {new Date(res.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/20 group-hover:text-white group-hover:bg-blue-600 transition-all shadow-lg active:scale-90">
                               <ExternalLink className="w-5 h-5" />
                            </button>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        )}

        {results.length === 0 && !isSearching && query && (
           <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4 animate-in fade-in zoom-in">
              <Clock className="w-16 h-16" />
              <p className="text-sm font-bold uppercase tracking-widest italic">No vectors matched your query.</p>
           </div>
        )}
      </section>
    </DashboardLayout>
  );
}
