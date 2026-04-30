import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, CheckCircle2, User as UserIcon, BadgeDollarSign, Package, Trash2, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp, Sale } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Sales() {
  const { products, sales, setSales, shifts } = useApp();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  
  // Sale Form
  const [saleForm, setSaleForm] = useState({
    productId: '',
    clientName: '',
    bundles: 1,
    pricePerBundle: 0,
    method: 'EFECTIVO' as Sale['method']
  });

  const selectedProduct = products.find(p => p.id === saleForm.productId);
  const total = saleForm.bundles * saleForm.pricePerBundle;

  // Calculadora para Ventas y Supervisor (Elite Edition)
  const tiempoCicloActual = shifts[0]?.cycleTime || 12.5;
  const calcularCompromisoEntrega = (cantidad: number, ciclo: number) => {
    const segTotales = (cantidad * ciclo);
    const horas = segTotales / 3600;
    return horas.toFixed(2);
  };

  const getWhatsAppLink = (phone: string, prod: string) => {
    const text = encodeURIComponent(`Hola, me interesa información sobre: ${prod}`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleRegister = () => {
    if (!saleForm.productId) return;
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      ...saleForm,
      total,
      timestamp: new Date().toISOString()
    };
    setSales([newSale, ...sales]);
    
    if (confirm('¿Deseas enviar confirmación por WhatsApp a este cliente?')) {
      const link = getWhatsAppLink('5500000000', selectedProduct?.name || 'Producto');
      window.open(link, '_blank');
    }

    setIsAdding(false);
    setSaleForm({ productId: '', clientName: '', bundles: 1, pricePerBundle: 0, method: 'EFECTIVO' });
  };

  const handleRemoveSale = (id: string) => {
    if (confirm('¿Deseas eliminar este registro de venta?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-500">
        <div className="p-6 bg-surface border-2 border-dashed border-white/5 rounded-3xl">
          <Package className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase tracking-widest text-primary">Sin Productos</h2>
          <p className="text-xs text-text-secondary mt-2 max-w-[250px] mx-auto">
            Necesitas registrar productos en el inventario antes de realizar una venta.
          </p>
        </div>
        <button 
          onClick={() => navigate('/inventario')}
          className="btn-primary px-8"
        >
          Ir a Inventario
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest">Nueva Venta</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Producto</label>
            <select 
              value={saleForm.productId}
              onChange={e => setSaleForm({...saleForm, productId: e.target.value})}
              className="input-field w-full"
            >
              <option value="">Selecciona un producto</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} en stock)</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Cliente (Opcional)</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Nombre del cliente"
                className="input-field w-full pl-12"
                value={saleForm.clientName}
                onChange={e => setSaleForm({...saleForm, clientName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Bultos</label>
              <input 
                type="number" 
                className="input-field w-full"
                value={saleForm.bundles}
                onChange={e => setSaleForm({...saleForm, bundles: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Precio/Bulto</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                <input 
                  type="number" 
                  className="input-field w-full pl-10"
                  value={saleForm.pricePerBundle}
                  onChange={e => setSaleForm({...saleForm, pricePerBundle: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Método de Pago</label>
            <div className="flex gap-2">
              {(['EFECTIVO', 'TRANSFERENCIA', 'CREDITO'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setSaleForm({...saleForm, method: m})}
                  className={`flex-1 py-3 px-2 rounded-xl border text-[8px] font-black tracking-widest transition-all ${
                    saleForm.method === m 
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_-5px_#00d4ff]' 
                      : 'border-white/5 bg-surface text-text-secondary'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Total Display */}
        <div className="space-y-3">
          <div className="glass-card p-6 flex justify-between items-center bg-primary/5 border-primary/20">
            <span className="text-xl font-black uppercase tracking-widest text-primary/50">Total</span>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">${total.toLocaleString()}</span>
              <p className="text-[10px] text-text-secondary uppercase">M.N.</p>
            </div>
          </div>

          <AnimatePresence>
            {saleForm.bundles > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-surface border border-white/5 rounded-xl flex items-center gap-3 text-success"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Tiempo estimado: {calcularCompromisoEntrega(saleForm.bundles * 1000, tiempoCicloActual)} horas
                  <span className="text-text-secondary ml-1 lowercase">(ciclo {tiempoCicloActual}s)</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleRegister}
          disabled={!saleForm.productId || total <= 0}
          className={`btn-primary w-full h-16 ${(!saleForm.productId || total <= 0) ? 'opacity-50 grayscale' : ''}`}
        >
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-black uppercase tracking-widest">Registrar Venta</span>
        </button>

        {/* Recent History */}
        <div className="space-y-4 pt-6">
          <h3 className="text-[10px] font-black text-text-secondary tracking-[0.3em] uppercase ml-1">Historial Reciente</h3>
          {sales.length === 0 ? (
            <div className="p-10 text-center opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] font-black tracking-widest uppercase">Sin ventas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 5).map(s => {
                const prod = products.find(p => p.id === s.productId);
                return (
                  <div key={s.id} className="glass-card p-4 flex justify-between items-center bg-white/[0.01]">
                    <div>
                      <h5 className="font-bold">{prod?.name || 'Producto Eliminado'}</h5>
                      <div className="flex gap-2 items-center">
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-surface text-text-secondary font-black tracking-tighter uppercase">{s.method}</span>
                        <span className="text-[10px] text-text-secondary uppercase font-bold">{s.bundles} bultos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">${s.total.toLocaleString()}</p>
                        <p className="text-[8px] text-text-secondary font-bold uppercase">{new Date(s.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveSale(s.id)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
