import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

const socials = [
  { label: 'Facebook', href: '#', icon: '/icons/facebook.svg' },
  { label: 'Instagram', href: '#', icon: '/icons/instagram.svg' },
  { label: 'X', href: '#', icon: '/icons/x.svg' },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-mint mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-12 w-auto mb-4" />
          <p className="text-base text-ink/60 max-w-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
          <div className="mt-6">
            <div className="text-sm tracking-widest text-ink/50 mb-3">{t('follow_us')}</div>
            <div className="flex gap-3.5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition shrink-0">
                  <img src={s.icon} alt="" className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-base font-medium text-ink mb-4">{t('navigation')}</div>
          <ul className="space-y-2.5 text-base text-ink/60">
            <li><Link to="/" className="hover:text-forest">{t('nav_home')}</Link></li>
            <li><Link to="/menu" className="hover:text-forest">{t('nav_menu')}</Link></li>
            <li><Link to="/about" className="hover:text-forest">{t('nav_about')}</Link></li>
            <li><Link to="/contact" className="hover:text-forest">{t('nav_contact')}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-base font-medium text-ink mb-4">{t('opening_hours')}</div>
          <ul className="space-y-2.5 text-base text-ink/60">
            <li>{t('mon_fri')}<br /><span className="text-ink/80">08:00 Am - 09:00 Pm</span></li>
            <li>{t('saturday')}<br /><span className="text-ink/80">08:00 Am - 09:00 Pm</span></li>
            <li>{t('sunday')}<br /><span className="text-ink/80">{t('closed')}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-sm text-ink/50">
          <span>&copy; {t('powered_by')} <span className="font-medium text-ink/70">Teknulugy</span></span>
          <span className="flex gap-5">
            <Link to="/privacy-terms" className="hover:text-forest">{t('terms_of_service')}</Link>
            <Link to="/privacy-terms" className="hover:text-forest">{t('privacy_policy')}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
