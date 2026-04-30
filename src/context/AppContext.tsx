import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppConfig {
  vozTono: number;
  vozVelocidad: number;
  idioma: string;
  fontSize: number;
}

export interface User {
  nombre: string;
  rol: 'OPERADOR' | 'VENTAS' | 'SUPERVISOR' | 'ADMIN';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export interface Sale {
  id: string;
  productId: string;
  clientName?: string;
  bundles: number;
  pricePerBundle: number;
  total: number;
  method: 'EFECTIVO' | 'TRANSFERENCIA' | 'CREDITO';
  timestamp: string;
}

export interface ShiftRecord {
  id: string;
  machineId: string;
  productId: string;
  totalProduced: number;
  waste: number;
  temperatures: number[];
  pressure: number;
  cycleTime: number;
  timestamp: string;
}

export interface EliteParams {
  zonas: number[];
  tiempos: {
    dCloseMold: number;
    dSeal: number;
    dStretch: number;
    dPreBlow: number;
    preBlow: number;
    blowDelay: number;
    moldDelay: number;
    exhaust: number;
    frequency: number;
    loadMat: number;
    dStart: number;
    endBlow: number;
    exFreq: number;
  };
  datos: {
    ciclo: number;
    merma: number;
    botella: string;
    gramaje: string;
  };
}

export interface Message {
  id: string;
  user: string;
  msg: string;
  status: 'Pendiente' | 'IA Respondido' | 'Atendido';
  timestamp: string;
}

export interface Recipe extends EliteParams {
  id: string;
  nombre: string;
  fecha: string;
}

interface AppContextType {
  usuario: User | null;
  setUsuario: (u: User | null) => void;
  config: AppConfig;
  setConfig: (c: AppConfig) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  shifts: ShiftRecord[];
  setShifts: React.Dispatch<React.SetStateAction<ShiftRecord[]>>;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Persistence helpers
  const getSaved = (key: string, def: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : def;
  };

  const [usuario, setUsuario] = useState<User | null>(() => getSaved('pet_user', null));
  const [config, setConfig] = useState<AppConfig>(() => getSaved('pet_config', {
    vozTono: 1.0,
    vozVelocidad: 0.9,
    idioma: 'es-MX',
    fontSize: 16
  }));

  const [products, setProducts] = useState<Product[]>(() => getSaved('pet_products', []));
  
  const [sales, setSales] = useState<Sale[]>(() => getSaved('pet_sales', []));

  const [shifts, setShifts] = useState<ShiftRecord[]>(() => getSaved('pet_shifts', []));

  const [recipes, setRecipes] = useState<Recipe[]>(() => getSaved('pet_recipes', []));

  const [messages, setMessages] = useState<Message[]>(() => getSaved('pet_messages', [
    { id: '1', user: 'Cliente A', msg: '¿Precio de 1L?', status: 'IA Respondido', timestamp: new Date().toISOString() },
    { id: '2', user: 'Distribuidora Norte', msg: 'Requerimos 50,000 unidades de 19g', status: 'Pendiente', timestamp: new Date().toISOString() }
  ]));

  useEffect(() => {
    localStorage.setItem('pet_user', JSON.stringify(usuario));
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem('pet_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('pet_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pet_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pet_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('pet_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('pet_messages', JSON.stringify(messages));
  }, [messages]);

  return (
    <AppContext.Provider value={{ 
      usuario, setUsuario, 
      config, setConfig,
      products, setProducts,
      sales, setSales,
      shifts, setShifts,
      recipes, setRecipes,
      messages, setMessages
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
};
