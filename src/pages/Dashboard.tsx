import React from 'react';
import { motion } from 'motion/react';
import { BadgeDollarSign, TrendingUp, AlertCircle, Package, Calculator, BrainCircuit, Sparkles, ClipboardCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Card = ({ title, value, unit = "$", icon: Icon, color = "text-primary", onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`glass-card p-5 flex flex-col gap-4 text-left border-l-4 border-l-primary relative overflow-hidden group w-full`}
    style={{ borderColor: color.includes('primary') ? '#00d4ff' : color.includes('danger') ? '#ff4444' : color.includes('success') ? '#00ffcc' : color }}
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-16 h-16" />
    </div>
    
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg bg-surface`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="text-[10px] font-black text-text-secondary tracking-[0.2em] uppercase">{title}</span>
    </div>
    
    <div className="flex items-baseline gap-1">
      <span className={`text-[10px] font-bold ${color}`}>{unit}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  </motion.button>
);

export default function Dashboard() {
  const { sales, shifts, products, recipes } = useApp();
  const navigate = useNavigate();

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProduced = shifts.reduce((acc, s) => acc + s.totalProduced, 0);
  const totalWaste = shifts.reduce((acc, s) => acc + s.waste, 0);
  const activeRecipes = recipes.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Hero Elite Section */}
      <div className="relative overflow-hidden glass-card p-8 border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-success/5">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Elite Edition</span>
            <span className="text-[10px] font-black text-success uppercase tracking-[0.4em] bg-success/10 px-3 py-1 rounded-full border border-success/20 animate-pulse">Sincronizado</span>
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic italic-bold">PET INDUSTRIAL</h2>
            <p className="text-sm text-text-secondary font-medium tracking-widest uppercase mt-2">Consola Maestra de Operaciones</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>
      </div>

      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            title="Ventas" 
            value={totalSales.toLocaleString()} 
            icon={BadgeDollarSign} 
            onClick={() => navigate('/ventas')}
          />
          <Card 
            title="Producido" 
            value={totalProduced.toLocaleString()} 
            unit="" 
            icon={TrendingUp} 
            color="text-success"
            onClick={() => navigate('/turno')}
          />
          <Card 
            title="Recetas" 
            value={activeRecipes.toString()} 
            unit="" 
            icon={ClipboardCheck} 
            color="text-primary"
            onClick={() => navigate('/reportes')}
          />
          <Card 
            title="Merma" 
            value={totalWaste.toLocaleString()} 
            unit="" 
            icon={AlertCircle} 
            color="text-danger"
            onClick={() => navigate('/turno')}
          />
        </div>
      </section>

      {/* Quick Access */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => navigate('/ia')}
            className="w-full glass-card p-5 flex items-center justify-between border-primary/20 hover:border-primary/50 transition-all bg-primary/5 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Asistente PET AI</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-tight">Análisis Inteligente de Procesos</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/calculadora')}
            className="w-full glass-card p-5 flex items-center justify-between border-success/20 hover:border-success/50 transition-all bg-success/5 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20 text-success group-hover:shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-all">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Calculadora de Voz</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-tight">Cálculos Logísticos Manos Libres</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Chart Placeholder */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase">Desempeño Diario</h3>
          <span className="text-[9px] font-black text-primary uppercase">Elite Analytics</span>
        </div>
        <div className="glass-card h-48 flex items-end justify-between p-6 gap-2">
          {[40, 70, 45, 90, 60, 85, 30].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1 }}
              className="w-full bg-primary/20 rounded-t-sm border-t border-primary/40 relative group"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[2px]" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
