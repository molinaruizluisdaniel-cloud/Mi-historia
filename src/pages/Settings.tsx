import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Volume2, Type, Globe, Plus, Minus, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { config, setConfig, usuario } = useApp();

  const Control = ({ label, value, onSub, onAdd, icon: Icon, unit = "" }: any) => (
    <div className="glass-card p-5 space-y-4">
      <div className="flex justify-between items-center text-[10px] font-black text-text-secondary tracking-widest uppercase">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3" />}
          <span>{label}: {value}{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onSub}
          className="flex-1 h-12 glass-card flex items-center justify-center text-primary active:scale-95 border-white/5 active:bg-primary/10"
        >
          <Minus className="w-5 h-5" />
        </button>
        <div className="flex-[0.5] h-12 flex items-center justify-center font-bold text-xl">
          Aa
        </div>
        <button 
          onClick={onAdd}
          className="flex-1 h-12 glass-card flex items-center justify-center text-primary active:scale-95 border-white/5 active:bg-primary/10"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/5 text-primary rounded-2xl border border-white/10">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest leading-none mb-1">Ajustes</h2>
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Configuración del Sistema</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* User Card */}
        <div className="glass-card p-5 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-surface rounded-xl">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-text-secondary uppercase font-black mb-1">Usuario Activo</p>
            <h4 className="font-bold text-lg">{usuario?.nombre} • <span className="text-primary">{usuario?.rol}</span></h4>
          </div>
        </div>

        {/* Language */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary tracking-widest uppercase">
            <Globe className="w-3 h-3" />
            <span>Idioma de Voz</span>
          </div>
          <div className="flex gap-2">
            {['es-MX', 'en-US'].map(lang => (
              <button
                key={lang}
                onClick={() => setConfig({ ...config, idioma: lang })}
                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${
                  config.idioma === lang 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-white/5 bg-surface text-text-secondary'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <Control 
          label="Tamaño de Letra" 
          value={config.fontSize} 
          icon={Type}
          onSub={() => setConfig({ ...config, fontSize: Math.max(12, config.fontSize - 1) })}
          onAdd={() => setConfig({ ...config, fontSize: Math.min(24, config.fontSize + 1) })}
        />

        <Control 
          label="Tono de Voz (Pitch)" 
          value={config.vozTono.toFixed(1)} 
          icon={Volume2}
          onSub={() => setConfig({ ...config, vozTono: Math.max(0.1, config.vozTono - 0.1) })}
          onAdd={() => setConfig({ ...config, vozTono: Math.min(2.0, config.vozTono + 0.1) })}
        />

        <Control 
          label="Velocidad de Voz" 
          value={config.vozVelocidad.toFixed(1)} 
          icon={Volume2}
          onSub={() => setConfig({ ...config, vozVelocidad: Math.max(0.1, config.vozVelocidad - 0.1) })}
          onAdd={() => setConfig({ ...config, vozVelocidad: Math.min(2.0, config.vozVelocidad + 0.1) })}
        />

        <button 
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance("Probando voz del sistema PET Industrial.");
            utterance.pitch = config.vozTono;
            utterance.rate = config.vozVelocidad;
            utterance.lang = config.idioma;
            window.speechSynthesis.speak(utterance);
          }}
          className="w-full h-16 glass-card bg-primary/10 border-primary/20 text-primary flex items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-widest text-sm">Probar Voz</span>
        </button>
      </div>
    </div>
  );
}
