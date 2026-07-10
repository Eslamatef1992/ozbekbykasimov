import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useI18n } from '../context/I18nContext';
import { IconMail, IconUser, IconBag } from './icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { openAuth } = useUI();
  const { t, locale, toggleLocale } = useI18n();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: t('nav_home') },
    { to: '/menu', label: t('nav_menu') },
    { to: '/about', label: t('nav_about') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <header className="bg-mint">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 py-5">
        <nav className="hidden md:flex items-center gap-8 text-base text-ink/80">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `pb-1 border-b-2 transition ${isActive ? 'border-forest text-ink font-medium' : 'border-transparent hover:text-forest'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="flex items-center justify-center">
          <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-14 w-auto" />
        </Link>

        <div className="flex items-center justify-end gap-5">
          <button
            onClick={toggleLocale}
            className="hidden sm:flex items-center gap-1.5 text-sm text-ink/70 hover:text-forest"
            aria-label="Toggle language"
          >
            <span aria-hidden>🇰🇼</span> {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <Link to="/cart" className="relative text-ink/70 hover:text-forest" aria-label={t('cart')}>
            <IconBag width="22" height="22" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-forest text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </Link>
          <Link to="/contact" className="text-ink/70 hover:text-forest" aria-label={t('nav_contact')}>
            <IconMail width="22" height="22" />
          </Link>
          {user ? (
            <div className="relative group">
              <button onClick={() => navigate('/profile')} className="text-ink/70 hover:text-forest" aria-label={t('profile')}>
                <IconUser width="22" height="22" />
              </button>
              <div className="absolute rtl:left-0 rtl:right-auto right-0 top-full mt-2 hidden group-hover:block bg-white border border-border rounded-lg shadow-md text-sm whitespace-nowrap">
                <button onClick={() => navigate('/profile')} className="block w-full text-left rtl:text-right px-4 py-2 hover:bg-mint/60">{user.full_name.split(' ')[0]}</button>
                <button onClick={logout} className="block w-full text-left rtl:text-right px-4 py-2 hover:bg-mint/60 text-ink/60">{t('logout')}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => openAuth('login')} className="text-ink/70 hover:text-forest" aria-label={t('login')}>
              <IconUser width="22" height="22" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
