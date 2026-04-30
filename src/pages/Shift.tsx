import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle2, Thermometer, Gauge, Activity, Sparkles, Save, Info, AlertTriangle } from 'lucide-react';
import { useApp, EliteParams, Recipe } from '../context/AppContext';

export default function ShiftElite() {
  const { products, shifts, setShifts, recipes, setRecipes } = useApp();
  
  // Configuración Maestra de Parámetros (Elite Edition)
  const [configuracion, setConfiguracion] = useState<EliteParams>({
    zonas: Array(8).fill(0),
    tiempos: {
      dCloseMold: 0, dSeal: 0, dStretch: 0,
      dPreBlow: 0, preBlow: 0, blowDelay: 0,
      moldDelay: 0, exhaust: 0, frequency: 0,
      loadMat: 0, dStart: 0,
      endBlow: 0, exFreq: 0
    },
    datos: { ciclo: 0, merma: 0, botella: "", gramaje: "" }
  });

  const [machineId, setMachineId] = useState('M-01');
  const [productId, setProductId] = useState('');
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const guardarAjusteEnPanel = (nombre: string) => {
    const receta: Recipe = { 
      ...configuracion, 
      id: Math.random().toString(36).substr(2, 9),
      nombre,
      fecha: new Date().toISOString() 
    };
    setRecipes([receta, ...recipes]);
    alert("Receta Guardada en Memoria Elite");
  };

  const handleRegisterTurno = () => {
    if (!productId) return;
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      machineId,
      productId,
      totalProduced: 0,
      waste: configuracion.datos.merma,
      temperatures: configuracion.zonas,
      pressure: configuracion.tiempos.endBlow,
      cycleTime: configuracion.datos.ciclo,
      timestamp: new Date().toISOString()
    };
    setShifts([newRecord, ...shifts]);
    alert('Producción registrada satisfactoriamente.');
  };

  const optimizar = (problema: string) => {
    setOptimizing(true);
    setTimeout(() => {
      let nuevasZonas = [...configuracion.zonas];
      let nuevosTiempos = { ...configuracion.tiempos };

      if (problema === 'Stress Whitening') {
        nuevasZonas[1] += 5; nuevasZonas[2] += 5; nuevasZonas[3] += 5;
        nuevosTiempos.dPreBlow -= 0.1;
      } else if (problema === 'Fondo Mal Formado') {
        nuevosTiempos.dStretch += 0.2;
        nuevosTiempos.endBlow += 0.5;
      } else if (problema === 'Hombros Delgados') {
        nuevosTiempos.dPreBlow += 0.1;
        nuevosTiempos.moldDelay += 0.5;
      }

      setConfiguracion({ ...configuracion, zonas: nuevasZonas, tiempos: nuevosTiempos });
      setOptimizing(false);
      setShowOptimizer(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Header Elite */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest leading-none">Panel Maestro</h2>
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.3em] mt-1">PET INDUSTRIAL • ELITE</p>
          </div>
        </div>
        <button 
          onClick={() => setShowOptimizer(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/20 to-success/20 border border-primary/30 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Optimizar
        </button>
      </div>

      {/* 1. CONTROL DE CALENTAMIENTO (8 ZONAS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">
          <Thermometer className="w-4 h-4" />
          <span>Control de Calentamiento (Zonas 1-8)</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {configuracion.zonas.map((temp, i) => (
            <div key={i} className="glass-card p-3 border-white/5">
              <label className="text-[8px] font-black text-text-secondary uppercase text-center block mb-1">Zona {i+1}</label>
              <input 
                type="number" 
                value={temp}
                onChange={e => {
                  const nz = [...configuracion.zonas];
                  nz[i] = parseInt(e.target.value) || 0;
                  setConfiguracion({ ...configuracion, zonas: nz });
                }}
                className="w-full bg-transparent text-center font-bold text-lg focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. CONTROL DE TIEMPOS (13 PARÁMETROS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-success tracking-[0.2em] uppercase ml-1">
          <Activity className="w-4 h-4" />
          <span>Tiempos de Ciclo y Soplado (Elite)</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(configuracion.tiempos).map(([meta, val]) => (
            <div key={meta} className="glass-card p-3 flex justify-between items-center border-l-2 border-l-success/40">
              <span className="text-[9px] font-bold text-text-secondary uppercase truncate pr-2">
                {meta.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <input 
                type="number" 
                step="0.1"
                value={val}
                onChange={e => {
                  const nt = { ...configuracion.tiempos, [meta]: parseFloat(e.target.value) || 0 };
                  setConfiguracion({ ...configuracion, tiempos: nt });
                }}
                className="w-16 bg-surface p-1 rounded text-right font-black text-xs focus:ring-1 focus:ring-success"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. DATOS DE PRODUCCIÓN */}
      <section className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-text-secondary tracking-widest uppercase flex items-center gap-1">
            <Gauge className="w-3 h-3" /> Cillo (Seg)
          </label>
          <input 
            type="number" 
            value={configuracion.datos.ciclo}
            onChange={e => setConfiguracion({ ...configuracion, datos: { ...configuracion.datos, ciclo: parseFloat(e.target.value) || 0 }})}
            className="input-field w-full text-center text-lg font-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-danger tracking-widest uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Merma (Und)
          </label>
          <input 
            type="number" 
            value={configuracion.datos.merma}
            onChange={e => setConfiguracion({ ...configuracion, datos: { ...configuracion.datos, merma: parseInt(e.target.value) || 0 }})}
            className="input-field w-full text-center text-lg font-black border-danger/30 text-danger"
          />
        </div>
      </section>

      {/* Acciones Elite */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button 
          onClick={() => {
            const nom = prompt("Nombre para esta Receta Maestra:");
            if (nom) guardarAjusteEnPanel(nom);
          }}
          className="h-16 glass-card border-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all text-primary"
        >
          <Save className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Guardar Receta</span>
        </button>

        <button 
          onClick={handleRegisterTurno}
          className="h-16 bg-primary text-black rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Ejecutar Turno</span>
        </button>
      </div>

      {/* Optimizer Modal */}
      <AnimatePresence>
        {showOptimizer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptimizer(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card w-full max-w-sm p-8 border-primary/20 space-y-8"
            >
              <div className="text-center space-y-2">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
                <h3 className="text-2xl font-black uppercase tracking-widest">Optimizador</h3>
                <p className="text-xs text-text-secondary">Selecciona el defecto visual detectado en la botella</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'Stress Whitening', label: 'Stress Whitening', desc: 'Blanqueamiento por estiramiento excesivo' },
                  { id: 'Fondo Mal Formado', label: 'Fondo Mal Formado', desc: 'Deficiencia en presión de fondo o tiempos' },
                  { id: 'Hombros Delgados', label: 'Hombros Delgados', desc: 'Falta de material en la parte superior' }
                ].map((prob) => (
                  <button
                    key={prob.id}
                    disabled={optimizing}
                    onClick={() => optimizar(prob.id)}
                    className="w-full p-4 glass-card border-white/5 hover:border-primary/50 text-left transition-all active:scale-95 disabled:opacity-50"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-primary">{prob.label}</span>
                      <Info className="w-3 h-3 text-white/30" />
                    </div>
                    <p className="text-[10px] text-text-secondary leading-tight">{prob.desc}</p>
                  </button>
                ))}
              </div>

              {optimizing && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary animate-pulse tracking-widest">ANALIZANDO PARÁMETROS...</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
