import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  category: string;
  image_url?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  created_at?: string;
}

interface CartItem {
  key: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rym_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('rym_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size = '42', color = '') => {
    setItems(prev => {
      const key = `${product.id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { key, product, size, color, qty: 1 }];
    });
  };

  const removeFromCart = (key: string) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const updateQty = (key: string, qty: number) => {
    if (qty < 1) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
