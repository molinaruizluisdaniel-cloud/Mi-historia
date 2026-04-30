import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Volume2, VolumeX, Bot, User, Sparkles, Binary } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy tu asistente PET. Pregúntame sobre inventario, ventas, mermas o producción.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { sales, shifts, products, config, recipes } = useApp();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = config.idioma;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
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
    if (isVoiceOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = config.vozTono;
      utterance.rate = config.vozVelocidad;
      utterance.lang = config.idioma;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI(process.env.GEMINI_API_KEY!);

      // Comprehensive Context for ELITE INDUSTRIAL PET Assistant
      const systemContext = `
        ERES EL CORTEX CENTRAL DE PET INDUSTRIAL - ELITE EDITION Professional.
        TU MISIÓN: Optimización total de planta, Control Técnico Maestro y Business Intelligence.

        DATOS DISPONIBLES EN TIEMPO REAL:
        - FECHA ACTUAL: ${new Date().toLocaleString()} (Usa esto para proyecciones temporales)
        - INVENTARIO: ${JSON.stringify(products)}
        - HISTORIAL DE VENTAS: ${JSON.stringify(sales)}
        - TURNOS Y PRODUCCIÓN: ${JSON.stringify(shifts)}
        - RECETARIO TÉCNICO: ${JSON.stringify(recipes)}

        DIRECTRICES DE RESPUESTA:
        1. ANÁLISIS TÉCNICO (SOPLADO): 
           - Si detectas mermas > 2%, sugiere ajustes en zonas de calor o tiempos basándote en el recetario.
           - Resuelve problemas: Stress Whitening (frío), Fondo descentrado (tensión), Hombros delgados.
        
        2. PROYECCIONES DE VENTAS (MÁXIMA INTELIGENCIA):
           - Analiza el historial de ventas (${sales.length} registros).
           - Proyecta ventas semanales y mensuales calculando tendencias (Growth Rate).
           - Si no hay suficientes datos, estima basándote en la capacidad de producción instalada.
        
        3. CÁLCULOS MATEMÁTICOS:
           - Eres una calculadora de alta precisión. Explica brevemente el desglose del cálculo si es complejo.
           - Usa los datos de ciclos por segundo de los turnos para calcular tiempos exactos de entrega.

        4. PERSONALIDAD:
           - Profesional, autoritario pero servicial, experto en ingeniería de polímeros y logística industrial.
           - Formato: Usa Negritas para puntos clave y listas para datos técnicos.
      `;

      const model = ai.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemContext
      });

      const result = await model.generateContent(userMessage);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'bot', text }]);
      handleSpeak(text);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMsg = 'Lo siento, tuve un problema al procesar tu solicitud.';
      setMessages(prev => [...prev, { role: 'bot', text: errorMsg }]);
      handleSpeak(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-230px)] animate-in fade-in duration-500">
      {/* AI Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest leading-none mb-1">Asistente PET</h2>
            <p className="text-[10px] text-text-secondary uppercase font-bold">Claude Sonnet 4.5 • Powered by AI</p>
          </div>
        </div>
        <button 
          onClick={() => setIsVoiceOn(!isVoiceOn)}
          className={`p-3 rounded-xl border transition-all ${
            isVoiceOn ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface border-white/5 text-text-secondary'
          }`}
        >
          {isVoiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'bot' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'bot' 
                ? 'bg-surface border-l-4 border-l-primary text-white rounded-tl-none prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50' 
                : 'bg-primary/10 text-primary border border-primary/20 rounded-tr-none font-medium'
            }`}>
              {msg.role === 'bot' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-surface p-4 rounded-2xl rounded-tl-none border-l-4 border-l-primary/30 space-y-2">
              <div className="flex items-center gap-2">
                <Binary className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Analizando Patrones Industriales...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 flex gap-2">
        <button 
          onClick={toggleListening}
          className={`p-4 glass-card flex items-center justify-center transition-all active:scale-95 ${
            isListening ? 'bg-danger text-white animate-pulse' : 'bg-surface text-primary'
          }`}
        >
          <Mic className="w-6 h-6" />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregúntame algo..."
            className="input-field w-full pr-14"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-black rounded-lg active:scale-90 transition-transform"
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
