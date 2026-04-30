import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, BadgeDollarSign, ShoppingBag, ArrowUpRight, MessageSquare, FileText, Share2, ClipboardCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { sales, shifts, recipes } = useApp();

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalUnits = sales.reduce((acc, s) => acc + s.bundles, 0);
  const totalEfficiency = shifts.length > 0 ? (shifts.reduce((acc, s) => acc + (s.totalProduced / (s.totalProduced + s.waste || 1)), 0) / shifts.length) * 100 : 0;

  const handleWhatsAppShare = () => {
    const text = `*REPORTE PET INDUSTRIAL - ELITE EDITION*%0A%0A` +
      `📅 Fecha: ${new Date().toLocaleDateString()}%0A` +
      `💰 Ventas Totales: $${totalSales.toLocaleString()}%0A` +
      `📈 Eficiencia: ${totalEfficiency.toFixed(1)}%%0A` +
      `📉 Merma Acumulada: ${shifts.reduce((acc, s) => acc + s.waste, 0)} unidades%0A%0A` +
      `*Último Ajuste de Máquina:*%0A` +
      `Zonas: ${shifts[0]?.temperatures?.join(', ') || 'N/A'}%0A` +
      `Presión: ${shifts[0]?.pressure || 'N/A'} bar%0A` +
      `Ciclo: ${shifts[0]?.cycleTime || 'N/A'}s`;
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePDFFake = () => {
    alert("Generando Reporte PDF Detallado...\n\nIncluyendo:\n- 8 Zonas de calor\n- 13 Tiempos de turno\n- Totales de producción\n- Eficiencia acumulada");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">Reportes Elite</h2>
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Sincronización Total</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePDFFake} className="p-3 bg-surface border border-white/5 rounded-xl text-text-secondary active:scale-95">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={handleWhatsAppShare} className="p-3 bg-success/10 border border-success/20 text-success rounded-xl active:scale-95">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recetas Maestras Nube Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Recetas en Nube</h3>
          <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">Respaldo Activo</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {recipes.length === 0 ? (
            <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl text-center">
              <p className="text-[10px] text-text-secondary uppercase font-bold">No hay recetas maestras guardadas</p>
            </div>
          ) : (
            recipes.slice(0, 3).map(r => (
              <div key={r.id} className="glass-card p-4 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-sm">{r.nombre}</h4>
                    <p className="text-[8px] text-text-secondary uppercase font-bold">{new Date(r.fecha).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="text-[8px] font-black text-primary border border-primary/20 px-3 py-1 rounded bg-primary/5 uppercase">Cargar</button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-primary">
          <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Ventas Totales</p>
          <p className="text-2xl font-black text-primary">${totalSales.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-success">
          <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Eficiencia</p>
          <p className="text-2xl font-black text-success">{totalEfficiency.toFixed(1)}%</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>Óptimo</span>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Ventas por Día</h3>
        <div className="glass-card p-6 h-64 flex items-end justify-between gap-2 relative">
          <div className="absolute inset-x-6 top-6 bottom-12 flex flex-col justify-between opacity-10 pointer-events-none">
            {[1, 2, 3, 4].map(i => <div key={i} className="border-t border-white w-full h-0" />)}
          </div>
          {[30, 45, 25, 60, 80, 50, 40].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="w-full bg-primary/20 border-t-2 border-primary group-hover:bg-primary/40 transition-all rounded-t-sm"
              />
              <span className="text-[8px] font-bold text-text-secondary">Día {i+1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Top Productos</h3>
        <div className="space-y-3">
          {[
            { name: 'Preforma 19g', units: 450, growth: 15 },
            { name: 'Bolsa 2kg', units: 230, growth: -5 },
            { name: 'Yurex Transparente', units: 120, growth: 8 },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface rounded-lg text-primary/40">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-none">{item.name}</h4>
                  <p className="text-[10px] text-text-secondary font-bold uppercase">{item.units} unidades</p>
                </div>
              </div>
              <span className={`text-[10px] font-black ${item.growth > 0 ? 'text-success' : 'text-danger'}`}>
                {item.growth > 0 ? '+' : ''}{item.growth}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
