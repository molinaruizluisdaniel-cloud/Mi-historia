export interface User {
  nombre: string;
  rol: string;
}

export interface AppConfig {
  vozTono: number;
  vozVelocidad: number;
  idioma: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
}

export interface Sale {
  id: string;
  product: string;
  client?: string;
  amount: number;
  price: number;
  method: 'EFECTIVO' | 'TRANSFERENCIA' | 'CREDITO';
  timestamp: number;
}

export interface TurnRecord {
  id: string;
  machine: string;
  product: string;
  totalProduced: number;
  merma: number;
  temperatures: number[];
  pressure: number;
  cycle: number;
  timestamp: number;
}
