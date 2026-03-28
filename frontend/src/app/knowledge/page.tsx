'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, 
  Upload, 
  Search, 
  Database, 
  ExternalLink, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Trash2,
  Plus,
  Loader2,
  Share2,
  Link as LinkIcon,
  Github,
  Figma,
  Slack,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'collections' | 'connectors'>('documents');
  const [documents, setDocuments] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'documents') {
        const { data } = await api.get('/documents');
        setDocuments(data.items);
      } else if (activeTab === 'collections') {
        const { data } = await api.get('/collections');
        setCollections(data);
      } else if (activeTab === 'connectors') {
        const { data } = await api.get('/connectors');
        setConnectors(data);
      }
    } catch (err) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
      toast.loading('Indexing vectors...', { id: 'upload' });
      await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Sync successful', { id: 'upload' });
      fetchData();
    } catch (err) {
      toast.error('Indexing failed', { id: 'upload' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(docs => docs.filter(d => d.id !== id));
      toast.success('Doc purged');
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  const handleSyncConnector = async (id: string) => {
    try {
      toast.loading('Syncing external data...', { id: 'sync' });
      await api.post(`/connectors/${id}/sync`);
      toast.success('Sync complete', { id: 'sync' });
      fetchData();
    } catch (err) {
      toast.error('Sync failed', { id: 'sync' });
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Knowledge Engine</h2>
            <p className="text-sm text-white/40 font-medium italic tracking-wide">Enterprise RAG context management and data synchronization.</p>
          </div>
          <button 
          onClick={() => activeTab === 'documents' ? fileInputRef.current?.click() : toast.error('Coming soon')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group">
             {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />}
             {activeTab === 'documents' ? 'Import Docs' : activeTab === 'collections' ? 'New Collection' : 'Connect API'}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} multiple className="hidden" />
        </header>

        <div className="flex items-center gap-6 border-b border-white/5 pb-2">
           {(['documents', 'collections', 'connectors'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all relative ${
                 activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'
               }`}
             >
               {tab}
               {activeTab === tab && (
                 <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
               )}
             </button>
           ))}
        </div>

        {activeTab === 'documents' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {documents.map((doc) => (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={doc.id} className="glass-morphism rounded-[32px] p-6 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-4 shadow-xl">
                     <div className="flex justify-between items-start">
                        <FileText className={`w-10 h-10 ${doc.file_type === 'pdf' ? 'text-red-400' : 'text-blue-400'}`} />
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5 ${doc.status === 'ready' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                           {doc.status}
                        </span>
                     </div>
                     <h4 className="text-sm font-bold text-white truncate">{doc.name}</h4>
                     <div className="mt-auto flex justify-between items-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        <span>{doc.wordCount || 0} Words</span>
                        <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-white/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        )}

        {activeTab === 'collections' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map(col => (
                <div key={col.id} className="glass-morphism rounded-[32px] p-8 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-4">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: col.color + '20', border: `1px solid ${col.color}40` }}>
                      <FolderOpen className="w-6 h-6" style={{ color: col.color }} />
                   </div>
                   <h4 className="text-xl font-bold text-white tracking-tight">{col.name}</h4>
                   <p className="text-sm text-white/40 italic leading-relaxed">{col.description || 'Enterprise collection'}</p>
                   <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{col.documentCount || 0} Documents</span>
                      <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-all">Open Suite →</button>
                   </div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'connectors' && (
           <div className="flex flex-col gap-6">
              {connectors.length === 0 && (
                <div className="py-20 text-center opacity-20 border-2 border-dashed border-white/5 rounded-[32px]">
                   <LinkIcon className="w-20 h-20 mx-auto mb-4" />
                   <h4 className="text-lg font-bold">No connected external sources.</h4>
                </div>
              )}
              {connectors.map(conn => (
                <div key={conn.id} className="glass-morphism rounded-[32px] p-6 flex items-center justify-between border border-white/5 group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                         {conn.type === 'github' ? <Github className="w-8 h-8 text-white" /> : conn.type === 'figma' ? <Figma className="w-8 h-8 text-[#F24E1E]" /> : <Slack className="w-8 h-8" />}
                      </div>
                      <div className="flex flex-col">
                         <h4 className="text-lg font-bold text-white uppercase tracking-tight">{conn.name}</h4>
                         <p className="text-xs text-white/30 font-medium tracking-wide">Last synced: {conn.last_sync_at ? new Date(conn.last_sync_at).toLocaleString() : 'Never'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${conn.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-400 border-red-500/10'}`}>
                         {conn.status}
                      </span>
                      <button onClick={() => handleSyncConnector(conn.id)} className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl transition-all hover:scale-105 active:scale-95 group">
                         <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}
      </section>
    </DashboardLayout>
  );
}
