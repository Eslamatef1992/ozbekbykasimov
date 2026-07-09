import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { IconMail, IconUser, IconBag } from './icons';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { openAuth } = useUI();
  const navigate = useNavigate();

  return (
    <header className="bg-mint">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 py-4">
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink/80">
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

        <Link to="/" className="flex items-center justify-center gap-2 font-display text-ink">
          <span className="w-9 h-9 rounded-full border border-forest/60 flex items-center justify-center text-[10px] tracking-widest">OZ</span>
          <span className="flex flex-col leading-none items-start">
            <span className="text-lg tracking-[0.15em]">OZBEK</span>
            <span className="text-[10px] tracking-[0.3em] text-forest -mt-0.5">BY KASIMOV</span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-4">
          <button className="hidden sm:flex items-center gap-1 text-xs text-ink/70 hover:text-forest">
            <span aria-hidden>🇰🇼</span> AR
          </button>
          <Link to="/cart" className="relative text-ink/70 hover:text-forest" aria-label="Cart">
            <IconBag />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-forest text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </Link>
          <Link to="/contact" className="text-ink/70 hover:text-forest" aria-label="Contact">
            <IconMail />
          </Link>
          {user ? (
            <div className="relative group">
              <button onClick={() => navigate('/profile')} className="text-ink/70 hover:text-forest" aria-label="Profile">
                <IconUser />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white border border-border rounded-lg shadow-md text-sm whitespace-nowrap">
                <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 hover:bg-mint/60">{user.full_name.split(' ')[0]}</button>
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-mint/60 text-ink/60">Log out</button>
              </div>
            </div>
          ) : (
            <button onClick={() => openAuth('login')} className="text-ink/70 hover:text-forest" aria-label="Log in">
              <IconUser />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
