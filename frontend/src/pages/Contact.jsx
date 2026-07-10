import { useEffect, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import api from '../services/api';
import { IconMail, IconPhone } from '../components/icons';

const socials = [
  { label: 'Facebook', href: '#', icon: '/icons/facebook.svg' },
  { label: 'Instagram', href: '#', icon: '/icons/instagram.svg' },
  { label: 'X', href: '#', icon: '/icons/x.svg' },
];

export default function Contact() {
  const [settings, setSettings] = useState({});
  const { t } = useI18n();
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const mapQuery = settings.address && settings.address !== 'TBD'
    ? settings.address
    : `${settings.site_name || 'Ozbek By Kasimov'}, Kuwait`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="text-sm text-ink/50 mb-6">{t('contact_us')}</div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="bg-mint/50 rounded-2xl px-6 sm:px-10 py-9">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10 bg-forest/40" />
            <h1 className="font-display text-2xl sm:text-3xl text-forest">{t('contact_us')}</h1>
            <span className="h-px w-10 bg-forest/40" />
          </div>
          <div className="border-t border-forest/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-base break-all">
              <IconMail className="text-forest shrink-0" width="22" height="22" />
              <span>{settings.contact_email || '—'}</span>
            </div>
            <div className="flex items-center gap-3 text-base">
              <IconPhone className="text-forest shrink-0" width="22" height="22" />
              <span>{settings.contact_phone || '—'}</span>
            </div>
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
      </section>

      <section className="pb-20">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/6] overflow-hidden">
          <iframe
            src={mapSrc}
            title={t('find_us_on_map')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full border-0"
          />
          <div className="hidden sm:flex absolute top-0 right-0 rtl:right-auto rtl:left-0 w-60 md:w-72 bg-white/80 backdrop-blur-sm rounded-bl-2xl rtl:rounded-bl-none rtl:rounded-br-2xl flex-col items-center text-center px-6 md:px-8 py-8 pointer-events-none">
            <div className="section-label mb-5 text-sm">{t('working_hours')}</div>
            <div className="mb-5">
              <div className="font-medium text-lg mb-1">{t('sun_to_tue')}</div>
              <div className="text-ink/70">{t('hours_range')}</div>
            </div>
            <div className="mb-5">
              <div className="font-medium text-lg mb-1">{t('fri_to_sat')}</div>
              <div className="text-ink/70">{t('hours_range')}</div>
            </div>
            <div>
              <div className="font-medium text-lg mb-1">{t('sunday')}</div>
              <div className="text-ink/70">{t('closed')}</div>
            </div>
          </div>
        </div>

        <div className="sm:hidden max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-mint/50 rounded-xl px-6 py-6 text-center">
            <div className="section-label justify-center mb-4 text-sm">{t('working_hours')}</div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              <div><span className="font-medium">{t('sun_to_tue')}:</span> <span className="text-ink/70">{t('hours_range')}</span></div>
              <div><span className="font-medium">{t('fri_to_sat')}:</span> <span className="text-ink/70">{t('hours_range')}</span></div>
              <div><span className="font-medium">{t('sunday')}:</span> <span className="text-ink/70">{t('closed')}</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
