import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/menu-items', label: 'Menu Items' },
  { to: '/orders', label: 'Orders' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/users', label: 'Users' },
  { to: '/settings', label: 'Site Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-navy text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
          <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-8 w-auto brightness-0 invert" />
          <span className="text-xs tracking-widest text-white/70">ADMIN</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/10'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-sm">
          <div className="text-white/60">{user?.full_name}</div>
          <button onClick={logout} className="text-white/80 hover:text-white mt-1">Log out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
