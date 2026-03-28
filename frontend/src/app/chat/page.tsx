'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Bot, 
  User, 
  Cpu, 
  Paperclip, 
  MoreVertical,
  ChevronRight,
  Sparkles,
  RefreshCcw,
  Share2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageOut, ConversationOut } from '@/types/chat';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationOut[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageOut[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/conversations');
      setConversations(data.items);
    } catch (err) {
      toast.error('Failed to load history');
    }
  };

  useEffect(() => {
    if (currentId) {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/conversations/${currentId}/messages`);
          setMessages(data.items);
        } catch (err) {
          toast.error('Failed to load messages');
        }
      };
      fetchMessages();
    }
  }, [currentId]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    let activeId = currentId;

    try {
      if (!activeId) {
        const { data: newConv } = await api.post('/conversations', { title: userText.slice(0, 30) + '...' });
        activeId = newConv.id;
        setCurrentId(activeId);
        setConversations([newConv, ...conversations]);
      }

      // Add user message locally
      const userMsg: MessageOut = {
          id: Math.random().toString(),
          conversationId: activeId,
          role: 'user',
          content: userText,
          createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMsg]);

      // REAL-TIME STREAMING IMPLEMENTATION
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'}/conversations/${activeId}/messages/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userText }),
      });

      if (!response.ok) throw new Error('Failed to start stream');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg: MessageOut = {
        id: 'streaming-assistant',
        conversationId: activeId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        sources: []
      };

      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'content') {
                  assistantMsg.content += data.delta;
                  setMessages(prev => prev.map(m => m.id === 'streaming-assistant' ? { ...assistantMsg } : m));
              } else if (data.type === 'sources') {
                  assistantMsg.sources = data.sources;
                  setMessages(prev => prev.map(m => m.id === 'streaming-assistant' ? { ...assistantMsg } : m));
              }
            } catch (e) {
              console.error('Error parsing stream chunk', e);
            }
          }
        }
      }

      // Final sync to get real IDs and metadata
      const { data: latest } = await api.get(`/conversations/${activeId}/messages`);
      setMessages(latest.items);
      fetchHistory(); // Update sidebar with last msg

    } catch (err) {
      toast.error('Connection lost. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    setCurrentId(null);
    setMessages([]);
    setInput('');
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-160px)] relative">
        {/* Chat History Sidebar */}
        <aside className="w-80 flex flex-col gap-4">
           <button 
           onClick={createNewChat}
           className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> New Chat
           </button>

           <div className="flex-1 glass-morphism rounded-3xl p-3 flex flex-col gap-2 overflow-y-auto no-scrollbar border-white/5">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 pt-2 pb-1">Recent Sessions</h4>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentId(conv.id)}
                  className={`w-full text-left p-4 rounded-2xl flex flex-col gap-1 transition-all group ${
                    currentId === conv.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${currentId === conv.id ? 'text-blue-400' : 'text-white/20'}`}>
                        {conv.model || 'Claude-3'}
                    </span>
                    <span className="text-[10px] text-white/20 font-medium">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white/90 truncate pr-4">{conv.title}</h5>
                  <p className="text-[11px] text-white/30 truncate font-medium">{conv.lastMessage || '...'}</p>
                </button>
              ))}
           </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 glass-morphism rounded-[32px] flex flex-col overflow-hidden relative border-white/5 shadow-2xl">
           <header className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10">
                    <Bot className="w-5 h-5 text-white shadow-inner" />
                 </div>
                 <div>
                    <h3 className="text-base font-bold text-white/90 tracking-wide flex items-center gap-2">
                       {currentId ? conversations.find(c => c.id === currentId)?.title : 'New Discovery'}
                    </h3>
                    <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                       <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                       {isTyping ? 'Synthesizing...' : 'Live Context Active'}
                    </p>
                 </div>
              </div>
           </header>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scroll-smooth no-scrollbar">
              {messages.length === 0 && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                    <Sparkles className="w-12 h-12 text-blue-400 fill-blue-400 anim-pulse" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">What are we exploring today?</h2>
                 </div>
              )}

              {messages.map((msg, idx) => (
                 <motion.div 
                   key={msg.id || idx}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex gap-5 group items-start ${msg.role === 'user' ? 'justify-end' : ''}`}
                 >
                    {msg.role === 'assistant' && (
                       <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                          <Cpu className="w-5 h-5 text-white" />
                       </div>
                    )}
                    <div className={`p-5 rounded-[24px] max-w-[80%] border relative transition-all ${
                       msg.role === 'user' 
                          ? 'bg-blue-600 border-white/10 text-white font-medium shadow-xl shadow-blue-600/10' 
                          : 'glass-morphism border-white/5 text-white/90 shadow-2xl'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                           <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest w-full mb-1">Citations</span>
                           {msg.sources.map((s, i) => (
                             <div key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 flex items-center gap-1.5 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                                <Paperclip className="w-2.5 h-2.5" /> {s.documentName}
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                       <div className="w-10 h-10 rounded-2xl bg-[#1A1B23] flex items-center justify-center border border-white/5 shadow-lg shrink-0">
                          <User className="w-5 h-5 text-blue-400" />
                       </div>
                    )}
                 </motion.div>
              ))}
           </div>

           <footer className="p-8 pt-4 pb-10 z-20 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/95 to-transparent">
              <form 
              onSubmit={handleSend}
              className="glass-morphism rounded-[28px] p-2 pr-3 flex items-center gap-4 border border-white/10 shadow-2xl relative group">
                 <button type="button" className="p-3 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all">
                    <Paperclip className="w-5 h-5" />
                 </button>
                 <textarea
                   rows={1}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                   placeholder="Prompt KnowledgeForge..."
                   className="flex-1 bg-transparent py-3 text-sm font-medium focus:ring-0 resize-none no-scrollbar"
                 />
                 <button 
                 type="submit"
                 disabled={!input.trim() || isTyping}
                 className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-30">
                    <Send className="w-5 h-5" />
                 </button>
              </form>
           </footer>
        </section>
      </div>
    </DashboardLayout>
  );
}
