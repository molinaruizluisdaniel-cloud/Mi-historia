import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Link as LinkIcon, RefreshCw, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Messages() {
  const { messages, products } = useApp();

  const handleGenerateSmartLink = () => {
    const defaultProduct = products[0]?.name || 'Preforma';
    const text = encodeURIComponent(`Hola, me interesa información sobre: ${defaultProduct}`);
    const link = `https://wa.me/521234567890?text=${text}`;
    window.open(link, '_blank');
    alert("Smart Link Generado y Abierto");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Header WhatsApp Elite */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-success/10 text-success rounded-2xl border border-success/20 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest leading-none">WhatsApp AI</h2>
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.3em] mt-1">GUÍA IA • BUSINESS ELITE</p>
          </div>
        </div>
        <button 
          onClick={() => {}}
          className="p-3 bg-surface border border-white/5 rounded-xl text-text-secondary active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Sync Status */}
      <div className="glass-card p-5 border-success/20 bg-success/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Sincronizado con Inventario Real</span>
          </div>
          <span className="text-[9px] font-bold text-text-secondary uppercase">v2.4.0</span>
        </div>
        
        <button 
          onClick={handleGenerateSmartLink}
          className="w-full h-12 bg-success text-black rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]"
        >
          <LinkIcon className="w-4 h-4" />
          Generar Smart Link para Clientes
        </button>
      </div>

      {/* Conversation List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Conversaciones Recientes</h3>
        <div className="space-y-2">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 border-white/5 group hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] font-bold text-primary italic">
                    {msg.user[0]}
                  </div>
                  <span className="font-bold text-sm">{msg.user}</span>
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  msg.status === 'IA Respondido' ? 'bg-primary/10 text-primary' : 'bg-surface text-text-secondary'
                }`}>
                  {msg.status}
                </span>
              </div>
              
              <div className="bg-surface/50 p-3 rounded-lg border border-white/5 mb-3">
                <p className="text-xs text-text-secondary italic">"{msg.msg}"</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[8px] text-text-secondary font-bold uppercase">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                <div className="flex gap-2">
                  <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-text-secondary hover:text-success transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <button className="w-full p-4 border border-white/5 rounded-2xl flex items-center gap-3 bg-surface/30 active:scale-95">
        <div className="p-2 bg-success/20 text-success rounded-lg">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div className="text-left flex-1">
          <span className="text-[10px] font-black text-white uppercase tracking-widest block">Abrir Business Monitor</span>
          <span className="text-[8px] text-text-secondary uppercase">Supervisión en tiempo real</span>
        </div>
      </button>
    </div>
  );
}
