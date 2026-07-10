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
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <img src="/images/about/hero-circle-big.svg" alt=""
            className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-[65%] h-[65%] object-contain" />
          <img src="/images/about/hero-circle-small.svg" alt=""
            className="absolute bottom-2 left-0 rtl:left-auto rtl:right-0 w-[38%] h-[38%] object-contain z-10" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center py-20">
        <div className="order-2 md:order-1 mx-auto max-w-sm w-full">
          <img src="/images/about/coffee-leaf.svg" alt="" className="w-full h-auto" />
        </div>
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
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-60 sm:w-72 bg-white/80 backdrop-blur-sm rounded-bl-2xl rtl:rounded-bl-none rtl:rounded-br-2xl flex flex-col items-center text-center px-6 sm:px-8 py-8">
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
