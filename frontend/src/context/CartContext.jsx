import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const CartContext = createContext(null);
const GUEST_KEY = 'ozbek_guest_cart';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}
// Same dish with a different set of extras is kept as a separate line, same
// behavior as the server-side cart.
function guestLineId(menuItemId, extras) {
  const extraIds = (extras || []).map((e) => e.id).sort().join(',');
  return `guest-${menuItemId}-${extraIds}`;
}
export function extrasTotal(extras) {
  return (extras || []).reduce((sum, e) => sum + Number(e.price || 0), 0);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { openCart } = useUI();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code, discount_amount }
  const [couponError, setCouponError] = useState('');
  const mergedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!user) { setItems(loadGuestCart()); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // On login, merge any items added while browsing as a guest into the
  // server-side cart once, then keep using the normal server-backed cart.
  useEffect(() => {
    if (!user) { mergedRef.current = false; refresh(); return; }
    if (mergedRef.current) return;
    mergedRef.current = true;
    const guestItems = loadGuestCart();
    if (!guestItems.length) { refresh(); return; }
    (async () => {
      setLoading(true);
      try {
        for (const gi of guestItems) {
          await api.post('/cart/items', { menu_item_id: gi.menu_item_id, quantity: gi.quantity, extras: gi.extras || [] });
        }
        localStorage.removeItem(GUEST_KEY);
      } finally {
        await refresh();
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // itemOrId: pass the full menu item object (needed so a guest cart, which
  // has no server join, can still display name/price/image) or a bare id
  // (fine when only logged-in call sites use it, e.g. profile re-order).
  async function addItem(itemOrId, quantity = 1, notes, extras = []) {
    const isObj = typeof itemOrId === 'object' && itemOrId !== null;
    const menuItemId = isObj ? itemOrId.id : itemOrId;

    if (!user) {
      const lineId = guestLineId(menuItemId, extras);
      const current = loadGuestCart();
      const existingIdx = current.findIndex((i) => i.id === lineId);
      let next;
      if (existingIdx >= 0) {
        next = current.map((i, idx) => (idx === existingIdx ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        next = [...current, {
          id: lineId,
          menu_item_id: menuItemId,
          name: isObj ? itemOrId.name : '',
          name_ar: isObj ? itemOrId.name_ar : '',
          price: isObj ? itemOrId.price : 0,
          image_url: isObj ? itemOrId.image_url : null,
          category_name: isObj ? itemOrId.category_name : null,
          quantity, notes: notes || null, extras: extras || [],
        }];
      }
      saveGuestCart(next);
      setItems(next);
      openCart();
      return;
    }

    const { data } = await api.post('/cart/items', { menu_item_id: menuItemId, quantity, notes, extras });
    setItems(data);
    openCart();
  }

  async function updateItem(cartItemId, quantity) {
    if (!user) {
      const next = loadGuestCart().map((i) => (i.id === cartItemId ? { ...i, quantity } : i));
      saveGuestCart(next);
      setItems(next);
      return;
    }
    const { data } = await api.patch(`/cart/items/${cartItemId}`, { quantity });
    setItems(data);
  }

  async function removeItem(cartItemId) {
    if (!user) {
      const next = loadGuestCart().filter((i) => i.id !== cartItemId);
      saveGuestCart(next);
      setItems(next);
      return;
    }
    const { data } = await api.delete(`/cart/items/${cartItemId}`);
    setItems(data);
  }

  async function clear() {
    setCoupon(null);
    setCouponError('');
    if (!user) {
      localStorage.removeItem(GUEST_KEY);
      setItems([]);
      return;
    }
    await api.delete('/cart');
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) + extrasTotal(i.extras)) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const discount = coupon ? Number(coupon.discount_amount) : 0;

  async function applyCoupon(code) {
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', { code, subtotal });
      setCoupon({ code: code.trim().toUpperCase(), discount_amount: data.discount_amount });
      return data;
    } catch (err) {
      setCoupon(null);
      setCouponError(err.response?.data?.message || 'Coupon code is not valid');
      throw err;
    }
  }

  function clearCoupon() {
    setCoupon(null);
    setCouponError('');
  }

  return (
    <CartContext.Provider value={{
      items, loading, subtotal, count, discount, coupon, couponError, refresh,
      addItem, updateItem, removeItem, clear, applyCoupon, clearCoupon, isGuest: !user,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
