import { createContext, useContext, useEffect, useState } from 'react';
import translations from '../i18n/translations';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem('ozbek_locale') || 'en');

  useEffect(() => {
    localStorage.setItem('ozbek_locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  function t(key) {
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  }

  function toggleLocale() {
    setLocale((l) => (l === 'en' ? 'ar' : 'en'));
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
