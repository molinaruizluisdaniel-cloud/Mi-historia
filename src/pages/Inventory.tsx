import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Search, Filter, Trash2, Edit3, X } from 'lucide-react';
import { useApp, Product } from '../context/AppContext';

export default function Inventory() {
  const { products, setProducts } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('TODOS');
  const [search, setSearch] = useState('');

  // Form State
  const [newProduct, setNewProduct] = useState({ name: '', category: 'PREFORMA', stock: 0, price: 0 });

  const categories = ['TODOS', 'PREFORMA', 'YUREX', 'BOLSA'];

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'TODOS' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = () => {
    if (!newProduct.name) return;
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProduct
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', category: 'PREFORMA', stock: 0, price: 0 });
    setIsAdding(false);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest">Inventario</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-4 bg-primary text-black rounded-2xl shadow-[0_0_20px_-5px_#00d4ff] active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="input-field w-full pl-12 h-14"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_-5px_#00d4ff]' 
                  : 'border-white/5 bg-surface text-text-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-text-secondary opacity-30 space-y-4">
            <Package className="w-16 h-16" />
            <p className="font-black tracking-widest text-xs uppercase">Sin productos registrados</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <motion.div 
              layout
              key={p.id}
              className="glass-card p-4 flex items-center justify-between border-l-4 border-l-primary"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-xl">
                  <Package className="w-6 h-6 text-primary/50" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{p.category}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest leading-none mb-1">Stock</p>
                  <p className="text-xl font-black text-primary">{p.stock}</p>
                </div>
                <button 
                  onClick={() => removeProduct(p.id)}
                  className="p-2 text-danger/50 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal - Add Product */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative glass-card w-full max-w-md p-6 border-primary/20 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-widest text-primary">Nuevo Producto</h3>
                <button onClick={() => setIsAdding(false)}><X className="text-text-secondary" /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Nombre</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="ej. Preforma 19g" 
                    className="input-field w-full" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Stock Inicial</label>
                    <input 
                      type="number" 
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                      className="input-field w-full" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Categoría</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="input-field w-full appearance-none"
                    >
                      {categories.filter(c => c !== 'TODOS').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="btn-primary w-full h-16"
              >
                <Plus className="w-5 h-5" />
                <span>Registrar Producto</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
