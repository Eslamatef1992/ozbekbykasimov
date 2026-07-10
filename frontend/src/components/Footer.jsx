import { Link } from 'react-router-dom';

// Instagram icon still pending from Figma - drop it in /public/icons/instagram.svg
// and add { label: 'Instagram', href: '#', icon: '/icons/instagram.svg' } below once you have it.
const socials = [
  { label: 'Facebook', href: '#', icon: '/icons/facebook.svg' },
  { label: 'X', href: '#', icon: '/icons/x.svg' },
];

export default function Footer() {
  return (
    <footer className="bg-mint mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-10 w-auto mb-3" />
          <p className="text-sm text-ink/60 max-w-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
          <div className="mt-5">
            <div className="text-xs tracking-widest text-ink/50 mb-2">FOLLOW US</div>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition">
                  <img src={s.icon} alt="" className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-ink mb-3">Navigation</div>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/" className="hover:text-forest">Home</Link></li>
            <li><Link to="/menu" className="hover:text-forest">Menu</Link></li>
            <li><Link to="/about" className="hover:text-forest">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-forest">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-ink mb-3">Opening Hours</div>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>Monday - Friday<br /><span className="text-ink/80">08:00 Am - 09:00 Pm</span></li>
            <li>Saturday<br /><span className="text-ink/80">08:00 Am - 09:00 Pm</span></li>
            <li>Sunday<br /><span className="text-ink/80">Closed</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink/50">
          <span>&copy; Powered by <span className="font-medium text-ink/70">Teknulugy</span></span>
          <span className="flex gap-4">
            <Link to="/privacy-terms" className="hover:text-forest">Terms Of Service</Link>
            <Link to="/privacy-terms" className="hover:text-forest">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
