import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addItem(menu_item_id, quantity = 1, notes) {
    const { data } = await api.post('/cart/items', { menu_item_id, quantity, notes });
    setItems(data);
  }

  async function updateItem(cartItemId, quantity) {
    const { data } = await api.patch(`/cart/items/${cartItemId}`, { quantity });
    setItems(data);
  }

  async function removeItem(cartItemId) {
    const { data } = await api.delete(`/cart/items/${cartItemId}`);
    setItems(data);
  }

  async function clear() {
    await api.delete('/cart');
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, subtotal, count, refresh, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
