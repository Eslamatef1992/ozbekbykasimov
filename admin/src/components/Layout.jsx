import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import {
  LayoutDashboard, LayoutGrid, UtensilsCrossed, Layers, ShoppingBag, Ticket,
  CalendarCheck, Users as UsersIcon, FileText, Share2, ShieldCheck, LogOut, Menu as MenuIcon, X, Languages, Truck,
} from 'lucide-react';

const links = [
  { to: '/', labelKey: 'nav_dashboard', end: true, icon: LayoutDashboard },
  { to: '/categories', labelKey: 'nav_categories', perm: 'menu', icon: LayoutGrid },
  { to: '/menu-items', labelKey: 'nav_menu_items', perm: 'menu', icon: UtensilsCrossed },
  { to: '/extras', labelKey: 'nav_extras', perm: 'extras', icon: Layers },
  { to: '/orders', labelKey: 'nav_orders', perm: 'orders', icon: ShoppingBag },
  { to: '/coupons', labelKey: 'nav_coupons', perm: 'coupons', icon: Ticket },
  // Delivery fees are super-admin-only - not a staff-assignable permission,
  // so this link is hidden from staff accounts entirely (see canAccess).
  { to: '/delivery-areas', labelKey: 'nav_delivery', superAdminOnly: true, icon: Truck },
  { to: '/reservations', labelKey: 'nav_reservations', perm: 'reservations', icon: CalendarCheck },
  { to: '/users', labelKey: 'nav_users', icon: UsersIcon },
  { to: '/settings', labelKey: 'nav_cms', perm: 'cms', icon: FileText },
  { to: '/social-links', labelKey: 'nav_social', perm: 'cms', icon: Share2 },
  { to: '/admins', labelKey: 'nav_admins', perm: 'admins', icon: ShieldCheck },
];

function canAccess(user, link) {
  if (link.superAdminOnly) return user?.role === 'admin';
  if (!link.perm) return true;
  if (!user) return false;
  if (user.role === 'admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes(link.perm);
}

function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

function SidebarContent({ visibleLinks, user, logout, onNavigate, t }) {
  return (
    <>
      <div className="px-5 py-5 flex items-center gap-2.5">
        <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-8 w-auto brightness-0 invert" />
        <span className="text-[10px] tracking-[0.2em] text-white/50 font-semibold">{t('admin_tag')}</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleLinks.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} className="shrink-0" />
              <span className="truncate">{t(l.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 pb-4 pt-3 mt-2 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {initials(user?.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-white truncate">{user?.full_name}</div>
            <div className="text-xs text-white/40 capitalize">{user?.role}</div>
          </div>
          <button onClick={logout} aria-label={t('log_out')} className="text-white/50 hover:text-white transition p-1.5">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { t, locale, toggleLocale } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleLinks = links.filter((l) => canAccess(user, l));
  const current = links.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)));

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-forest-dark flex-col fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 no-print">
        <SidebarContent visibleLinks={visibleLinks} user={user} logout={logout} t={t} />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden no-print">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-forest-dark flex flex-col h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
            <SidebarContent visibleLinks={visibleLinks} user={user} logout={logout} onNavigate={() => setMobileOpen(false)} t={t} />
          </aside>
        </div>
      )}

      <div className="flex-1 md:ml-64 rtl:md:ml-0 rtl:md:mr-64 flex flex-col min-h-screen">
        <header className="topbar sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-line px-4 sm:px-8 py-4 flex items-center gap-3 no-print">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-muted hover:text-ink" aria-label="Open menu">
            <MenuIcon size={20} />
          </button>
          <div className="text-sm font-medium text-ink flex-1">{current ? t(current.labelKey) : 'Admin'}</div>
          <button onClick={toggleLocale} className="btn-secondary py-1.5 px-3 text-xs" aria-label="Toggle language">
            <Languages size={14} /> {locale === 'en' ? 'العربية' : 'English'}
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
