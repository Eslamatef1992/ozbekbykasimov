import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  function openAuth(mode = 'login') {
    setAuthMode(mode);
    setAuthOpen(true);
  }
  function closeAuth() {
    setAuthOpen(false);
  }

  return (
    <UIContext.Provider value={{ authOpen, authMode, openAuth, closeAuth, setAuthMode }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
