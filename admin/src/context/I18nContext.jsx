import { createContext, useContext, useEffect, useState } from 'react';
import translations from '../i18n/translations';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem('ozbek_admin_locale') || 'en');

  useEffect(() => {
    localStorage.setItem('ozbek_admin_locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  function t(key, vars) {
    let str = translations[locale]?.[key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
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
