import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Cpu, 
  BarChart3, 
  Settings,
  LogOut,
  BadgeDollarSign,
  AlertCircle,
  Calculator,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { usuario, setUsuario } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'inicio', path: '/inicio', label: 'INICIO', icon: LayoutGrid },
    { id: 'inventario', path: '/inventario', label: 'STOCK', icon: Package },
    { id: 'turno', path: '/turno', label: 'TURNO', icon: TrendingUp },
    { id: 'mensajes', path: '/mensajes', label: 'WHATSAPP', icon: MessageSquare },
    { id: 'ventas', path: '/ventas', label: 'VENTAS', icon: ShoppingCart },
    { id: 'ia', path: '/ia', label: 'IA', icon: Cpu },
    { id: 'reportes', path: '/reportes', label: 'REPORTS', icon: BarChart3 },
    { id: 'ajustes', path: '/ajustes', label: 'AJUSTES', icon: Settings },
  ];

  if (!usuario && location.pathname !== '/') {
    return null; // Let the router handle redirection
  }

  return (
    <div className="min-h-screen bg-background pb-28 text-white relative">
      {/* Header */}
      <header className="p-6 flex justify-between items-start sticky top-0 bg-background/80 backdrop-blur-lg z-40 border-b border-white/5">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-1">Hola,</p>
          <h2 className="text-2xl font-black tracking-tight">{usuario?.nombre.toUpperCase() || 'USUARIO'}</h2>
          <p className="text-primary text-[10px] font-black tracking-[0.2em]">{usuario?.rol || 'OPERADOR'}</p>
        </div>
        <button 
          onClick={() => {
            setUsuario(null);
            navigate('/');
          }}
          className="p-3 bg-danger/10 text-danger rounded-xl border border-danger/20 hover:bg-danger/20 transition-all active:scale-95"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-2xl mx-auto overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 px-2 py-3 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 shadow-[0_0_15px_-5px_#00d4ff]' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                </div>
                <span className="text-[8px] font-black tracking-tighter">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
