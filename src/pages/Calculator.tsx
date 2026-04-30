import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalculatorIcon, Volume2, Mic, MicOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [resultado, setResultado] = useState('0.00');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { config } = useApp();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = config.idioma;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Clean transcript to replace words with math symbols if needed
        let cleaned = transcript.toLowerCase()
          .replace(/por/g, 'x')
          .replace(/entre/g, '÷')
          .replace(/más/g, '+')
          .replace(/menos/g, '-')
          .replace(/punto/g, '.')
          .replace(/[^0-9x÷+\-.]/g, '');
        
        setInput(prev => prev + cleaned);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [config.idioma]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = config.vozTono;
      utterance.rate = config.vozVelocidad;
      utterance.lang = config.idioma;
      window.speechSynthesis.speak(utterance);
    }
  };

  const ejecutarCalculo = () => {
    try {
      let formula = input
        .replace(/x/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.');

      // eslint-disable-next-line no-new-func
      const calcResult = new Function(`return ${formula}`)();
      
      if (isNaN(calcResult) || !isFinite(calcResult)) {
        throw new Error("Invalid");
      }

      const formattedRes = Number(calcResult).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      setResultado(formattedRes);
      handleSpeak(`El resultado es ${calcResult}`);
    } catch (e) {
      handleSpeak("Error en operación");
      setResultado("ERROR");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-success/10 text-success rounded-2xl border border-success/20">
          <CalculatorIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest">Calculadora</h2>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest">Voz Humana Activa</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Display */}
        <motion.div 
          layoutId="calc-display"
          className="glass-card p-10 flex flex-col items-center justify-center relative overflow-hidden bg-success/[0.02]"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-success/40" />
          <span className="text-[10px] text-success/50 font-bold uppercase tracking-[0.5em] mb-4">Resultado</span>
          <div className="flex items-baseline gap-2 text-success">
            <span className="text-xl font-bold opacity-50">$</span>
            <span className="text-5xl font-black tracking-tighter">{resultado}</span>
          </div>
        </motion.div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <button 
              onClick={toggleListening}
              className={`p-4 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                isListening ? 'bg-danger text-white border-danger animate-pulse' : 'bg-surface border-white/5 text-primary'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <input
              type="text"
              inputMode="none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Introduce operación (ej. 150 * 3)"
              className="input-field flex-1 text-center text-xl font-bold h-16 bg-surface border-white/5"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[7, 8, 9, '÷', 4, 5, 6, 'x', 1, 2, 3, '-', 0, '.', 'C', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') setInput('');
                  else setInput(prev => prev + btn);
                }}
                className={`h-14 rounded-xl font-black text-lg flex items-center justify-center transition-all active:scale-95 border ${
                  typeof btn === 'number' || btn === '.'
                    ? 'bg-surface border-white/5 text-white'
                    : btn === 'C'
                    ? 'bg-danger/10 border-danger/20 text-danger'
                    : 'bg-primary/10 border-primary/20 text-primary'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={ejecutarCalculo}
          className="btn-primary w-full h-16 bg-success text-black border-none shadow-[0_0_20px_-5px_#00ffcc] hover:shadow-[0_0_25px_-5px_#00ffcc]"
        >
          <Volume2 className="w-5 h-5 fill-current" />
          <span className="uppercase tracking-[0.2em] font-black">Calcular y Hablar</span>
        </button>
      </div>
    </div>
  );
}
