'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight, 
  Plus, 
  Search, 
  MoreVertical,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ClipboardList,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/meetings?tab=${activeTab}`);
      setMeetings(data);
    } catch (err) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecap = async (id: string) => {
    try {
      toast.loading('Synthesizing AI Recap...', { id: 'recap' });
      const { data } = await api.get(`/meetings/${id}/recap`);
      toast.success('Recap Generated', { id: 'recap' });
      const meeting = meetings.find(m => m.id === id);
      setSelectedMeeting({ ...meeting, recap: data });
    } catch (err) {
      toast.error('Synthesis failed');
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1200">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1 uppercase italic">Intelligence Briefings</h2>
              <p className="text-sm text-white/40 font-medium tracking-wide">Sync calls from Zoom/Teams and generate AI action items.</p>
           </div>
           <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg active:scale-95 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> New Briefing
           </button>
        </header>

        <div className="flex gap-4 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
           {(['upcoming', 'past'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                 activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Meetings List */}
           <div className="lg:col-span-2 flex flex-col gap-6">
              {meetings.length === 0 && !loading && (
                <div className="py-32 text-center opacity-30 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center gap-4">
                   <Video className="w-16 h-16" />
                   <p className="text-sm font-bold uppercase tracking-widest italic">No {activeTab} briefings found.</p>
                </div>
              )}
              {meetings.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => activeTab === 'past' ? fetchRecap(m.id) : null}
                  className={`glass-morphism rounded-[32px] p-8 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between group cursor-pointer shadow-2xl ${activeTab === 'past' && selectedMeeting?.id === m.id ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                   <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${activeTab === 'upcoming' ? 'text-blue-400' : 'text-purple-400 group-hover:bg-purple-500/10'}`}>
                         <Video className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <h4 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{m.title}</h4>
                         <div className="flex items-center gap-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">
                            <span className="flex items-center gap-2 italic"><Calendar className="w-3.5 h-3.5" /> {new Date(m.scheduledAt || m.endedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2 italic"><Clock className="w-3.5 h-3.5" /> {m.durationMinutes} Min</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex -space-x-3">
                         {[1, 2, 3].map((i) => (
                           <div key={i} className="w-8 h-8 rounded-full border-4 border-[#0A0B10] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                              {i}
                           </div>
                         ))}
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-white transition-all group-hover:translate-x-2" />
                   </div>
                </div>
              ))}
           </div>

           {/* AI Recap Panel */}
           <div className="flex flex-col gap-8">
              <AnimatePresence mode="wait">
                 {selectedMeeting ? (
                    <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={selectedMeeting.id}
                    className="glass-morphism rounded-[40px] p-8 border border-white/5 shadow-2xl relative overflow-hidden h-fit flex flex-col gap-6"
                    >
                       <div className="flex items-center justify-between px-2">
                          <h3 className="text-base font-black text-white/80 flex items-center gap-3 uppercase tracking-widest italic">
                             <Sparkles className="w-6 h-6 text-amber-500 anim-pulse" /> AI Recap
                          </h3>
                          <button onClick={() => setSelectedMeeting(null)} className="text-[10px] font-bold text-white/20 hover:text-white transition-all uppercase tracking-widest">Close</button>
                       </div>

                       <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                          <p className="text-xs text-white/70 leading-relaxed italic font-medium">
                             {selectedMeeting.recap.summary}
                          </p>
                       </div>

                       <div className="flex flex-col gap-4">
                          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 italic">Neural Action Items</h4>
                          <div className="flex flex-col gap-2">
                             {selectedMeeting.recap.actionItems.map((item: any) => (
                               <div key={item.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4 group/item hover:bg-white/10 transition-all">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                                  <span className="text-xs font-bold text-white/60 group-hover/item:text-white transition-colors">{item.description}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 italic">Key Decisions</h4>
                          <ul className="space-y-3 px-2">
                             {selectedMeeting.recap.decisions.map((dec: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-[11px] text-white/40 font-medium italic">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  {dec}
                               </li>
                             ))}
                          </ul>
                       </div>

                       <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                          Send Recap to Slack
                       </button>
                    </motion.div>
                 ) : (
                    <div className="glass-morphism rounded-[40px] p-10 border border-white/5 text-center flex flex-col items-center gap-6 opacity-40">
                       <ClipboardList className="w-16 h-16 text-white/20" />
                       <p className="text-xs font-bold uppercase tracking-[0.2em] italic">Select a briefing to view neural insights.</p>
                    </div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
