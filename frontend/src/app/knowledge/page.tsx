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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'collections' | 'connectors'>('documents');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/documents');
      setDocuments(data.items);
    } catch (err) {
      toast.error('Failed to load documents');
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
      toast.loading('Uploading and Indexing Vectors...', { id: 'upload' });
      await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Upload complete! Vectors are being synced.', { id: 'upload' });
      fetchDocuments();
    } catch (err) {
      toast.error('Upload failed. Check your API keys.', { id: 'upload' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(docs => docs.filter(d => d.id !== id));
      toast.success('Document purged');
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Knowledge Engine</h2>
            <p className="text-sm text-white/40 font-medium italic tracking-wide">Manage your enterprise vectors, datasets, and context sources.</p>
          </div>
          <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group disabled:opacity-50">
             {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />}
             {isUploading ? 'Executing Index...' : 'Real Data Upload'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            multiple 
            className="hidden" 
          />
        </header>

        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
           {(['documents', 'collections', 'connectors'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-white/30 hover:text-white/60'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="flex flex-col gap-6">
           <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-4">
                <div className="relative group">
                   <input 
                    type="text" 
                    placeholder="Search your index..." 
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-medium focus:bg-white/10 transition-all w-64"
                   />
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-all">
                   <Filter className="w-3.5 h-3.5" /> Filter
                </button>
             </div>
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{documents.length} Records found</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {documents.map((doc, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={doc.id}
                    className="glass-morphism rounded-[32px] p-6 border border-white/5 hover:bg-white/[0.07] transition-all group relative overflow-hidden flex flex-col gap-4 shadow-xl"
                  >
                     <div className="flex items-start justify-between relative z-10">
                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${
                          doc.file_type === 'pdf' ? 'text-red-400' : 'text-blue-400'
                        } group-hover:scale-110 transition-transform`}>
                           <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                             doc.status === 'ready' || doc.status === 'indexed'
                               ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                               : 'bg-amber-500/10 text-amber-400 border-amber-500/10 anim-pulse'
                           }`}>
                              {doc.status === 'ready' || doc.status === 'indexed' 
                                 ? <CheckCircle2 className="w-2.5 h-2.5" /> 
                                 : <Clock className="w-2.5 h-2.5" />
                              }
                              {doc.status}
                           </span>
                           <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-white transition-all">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                     <div className="relative z-10">
                        <h4 className="text-sm font-bold text-white/90 truncate mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{doc.name}</h4>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] text-white/30 font-medium">8.4 MB</p>
                           <span className="w-1 h-1 bg-white/10 rounded-full" />
                           <p className="text-[10px] text-white/30 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>

                     <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 relative z-10">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{doc.word_count || 0} Words</p>
                        <div className="flex items-center gap-2">
                           <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500/20 hover:bg-blue-600/[0.02] transition-all cursor-pointer group min-h-[220px]">
                 <div className="p-4 rounded-full bg-white/5 text-white/10 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500">
                    <Plus className="w-8 h-8" />
                 </div>
                 <div className="text-center">
                    <h4 className="text-sm font-bold text-white/20 group-hover:text-white/60 transition-all">Upload Document</h4>
                    <p className="text-[10px] text-white/10 font-medium mt-1 uppercase tracking-widest leading-none">PDF, DOCX, TXT, CSV</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
