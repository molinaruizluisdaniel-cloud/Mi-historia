import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, LogIn, UserPlus, ShieldCheck, User as UserIcon, BadgeDollarSign, ClipboardList, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { id: 'OPERADOR', icon: UserIcon },
  { id: 'VENTAS', icon: BadgeDollarSign },
  { id: 'SUPERVISOR', icon: ClipboardList },
  { id: 'ADMIN', icon: Shield },
];

export default function Login() {
  const [modo, setModo] = useState<'ingresar' | 'crear'>('crear');
  const [rol, setRol] = useState<any>('OPERADOR');
  const [pin, setPin] = useState('');
  const [nombre, setNombre] = useState('');
  const { setUsuario } = useApp();
  const navigate = useNavigate();

  const handleKeypress = (n: number) => {
    if (pin.length < 6) {
      setPin(prev => prev + n);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleEntrar = () => {
    if (pin.length >= 4) {
      setUsuario({ nombre: nombre || 'Usuario', rol });
      navigate('/inicio');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mt-8 mb-10"
      >
        <Zap className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-black tracking-widest">PET INDUSTRIAL</h1>
        <p className="text-text-secondary text-xs tracking-widest uppercase">Operations Console</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {(['ingresar', 'crear'] as const).map((m) => (
          <button
            key={m}
            id={`tab-${m}`}
            onClick={() => setModo(m)}
            className={`flex-1 py-3 rounded-xl border transition-all font-bold uppercase tracking-wider text-sm ${
              modo === m 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-white/5 bg-white/5 text-text-secondary'
            }`}
          >
            {m === 'crear' ? 'Crear' : 'Ingresar'}
          </button>
        ))}
      </div>

      {/* Form Area */}
      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">
            Nombre / Operador
          </label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">
            Rol de Acceso
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => setRol(r.id)}
                  className={`p-3 rounded-lg flex items-center gap-3 transition-all border ${
                    rol === r.id 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-transparent bg-surface text-text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{r.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Display */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">
              PIN ({pin.length}/6)
            </label>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  i < pin.length ? 'bg-primary border-primary' : 'border-white/20'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleKeypress(n)}
                className="h-16 glass-card flex items-center justify-center text-xl font-bold active:bg-primary/20"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleKeypress(0)}
              className="h-16 glass-card flex items-center justify-center text-xl font-bold active:bg-primary/20"
            >
              0
            </button>
            <button
              onClick={handleClear}
              className="h-16 flex items-center justify-center text-primary active:scale-95"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>

      {/* Main Action */}
      <button
        id="btn-login"
        onClick={handleEntrar}
        disabled={pin.length < 4}
        className={`btn-primary w-full mt-6 transition-all ${
          pin.length < 4 ? 'opacity-50 grayscale cursor-not-allowed' : 'opacity-100'
        }`}
      >
        {modo === 'crear' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
        <span>{modo === 'crear' ? 'CREAR CUENTA' : 'INGRESAR'}</span>
      </button>
    </div>
  );
}
