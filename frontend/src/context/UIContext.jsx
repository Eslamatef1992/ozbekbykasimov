import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [cartOpen, setCartOpen] = useState(false);

  function openAuth(mode = 'login') {
    setAuthMode(mode);
    setAuthOpen(true);
  }
  function closeAuth() {
    setAuthOpen(false);
  }
  function openCart() {
    setCartOpen(true);
  }
  function closeCart() {
    setCartOpen(false);
  }

  return (
    <UIContext.Provider value={{ authOpen, authMode, openAuth, closeAuth, setAuthMode, cartOpen, openCart, closeCart }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
