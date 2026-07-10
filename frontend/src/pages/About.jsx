import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';

export default function About() {
  const [settings, setSettings] = useState({});
  const { t } = useI18n();
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="text-sm text-ink/50 mb-6">{t('about_us')}</div>
      </div>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center py-8">
        <div>
          <div className="section-label mb-5">{t('about_us')}</div>
          <h1 className="page-heading mb-5">{t('about_heading')}</h1>
          <p className="text-ink/60 text-lg leading-relaxed max-w-md">
            {settings.about_text ||
              'Lorem ipsum dolor sit amet consectetur. Dolor elit vitae nunc varius. Facilisis eget cras sit semper sit enim. Turpis aliquet at ac eu donec ut. Sagittis vestibulum at quis non massa netus.'}
          </p>
        </div>
        <div className="aspect-square rounded-full bg-mint overflow-hidden max-w-sm mx-auto" />
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center py-20">
        <div className="order-2 md:order-1 aspect-square bg-mint mx-auto max-w-sm w-full"
          style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)' }} />
        <div className="order-1 md:order-2">
          <div className="section-label mb-5">{t('coffee_menu')}</div>
          <h2 className="page-heading mb-5">{t('coffee_menu_heading')}</h2>
          <p className="text-ink/60 text-lg leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet consectetur. Facilisis eget cras sit semper. Sagittis vestibulum at quis.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-ink/10">
          <div className="absolute left-6 bottom-6 rtl:right-6 rtl:left-auto bg-white/95 rounded-xl px-7 py-6 w-72 shadow-lg">
            <div className="section-label mb-4 text-sm">{t('reservation')}</div>
            <div className="flex flex-col gap-3">
              <Link to="/book-table" className="btn-primary text-center">{t('book_a_table')}</Link>
              <Link to="/contact" className="btn-outline text-center">{t('contact_us_btn')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
