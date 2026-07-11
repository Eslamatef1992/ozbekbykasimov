import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { resolveImageUrl } from '../utils/media';

export default function About() {
  const [settings, setSettings] = useState({});
  const { t, locale } = useI18n();
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const aboutText = (locale === 'ar' && settings.about_text_ar) ? settings.about_text_ar : settings.about_text;
  const coffeeText = (locale === 'ar' && settings.about_coffee_text_ar) ? settings.about_coffee_text_ar : settings.about_coffee_text;
  const reservationPhoto = settings.about_reservation_photo ? resolveImageUrl(settings.about_reservation_photo) : '/images/about/reservation-chef.svg';

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
            {aboutText ||
              'Lorem ipsum dolor sit amet consectetur. Dolor elit vitae nunc varius. Facilisis eget cras sit semper sit enim. Turpis aliquet at ac eu donec ut. Sagittis vestibulum at quis non massa netus.'}
          </p>
        </div>
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <img src="/images/about/hero-circle-big.svg" alt=""
            className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-[86%] h-[87%] object-contain" />
          <img src="/images/about/hero-circle-medium.svg" alt=""
            className="absolute top-[53%] left-[5%] rtl:left-auto rtl:right-[5%] w-[52%] h-[47%] object-contain z-10" />
          <img src="/images/about/hero-circle-small.svg" alt=""
            className="absolute top-[36%] left-0 rtl:left-auto rtl:right-0 w-[27%] h-[27%] object-contain z-20" />
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
            {coffeeText || 'Lorem ipsum dolor sit amet consectetur. Facilisis eget cras sit semper. Sagittis vestibulum at quis.'}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[47/25] bg-ink/10">
          <img src={reservationPhoto} alt=""
            className="absolute inset-0 w-full h-full object-cover" />

          <div className="hidden sm:flex absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 w-56 md:w-72 bg-black/35 flex-col justify-center items-center text-center px-6 md:px-8">
            <div className="font-display text-2xl text-white mb-6">{t('working_hours')}</div>
            <div className="mb-5">
              <div className="font-semibold text-lg text-white mb-1">{t('sun_to_tue')}</div>
              <div className="text-white/80">{t('hours_range')}</div>
            </div>
            <div className="mb-5">
              <div className="font-semibold text-lg text-white mb-1">{t('fri_to_sat')}</div>
              <div className="text-white/80">{t('hours_range')}</div>
            </div>
            <div>
              <div className="font-semibold text-lg text-white mb-1">{t('sunday')}</div>
              <div className="text-white/80">{t('closed')}</div>
            </div>
          </div>

          <div className="hidden sm:block absolute left-6 bottom-6 rtl:right-6 rtl:left-auto bg-white/95 rounded-xl px-7 py-6 w-64 md:w-72 shadow-lg">
            <div className="section-label mb-4 text-sm">{t('reservation')}</div>
            <div className="flex flex-col gap-3">
              <Link to="/book-table" className="btn-primary text-center">{t('book_a_table')}</Link>
              <Link to="/contact" className="btn-outline text-center">{t('contact_us_btn')}</Link>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-6 space-y-5">
          <div className="bg-ink rounded-2xl px-6 py-7 text-center text-white">
            <div className="font-display text-xl mb-5">{t('working_hours')}</div>
            <div className="mb-4">
              <div className="font-semibold text-base mb-1">{t('sun_to_tue')}</div>
              <div className="text-white/70 text-sm">{t('hours_range')}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-base mb-1">{t('fri_to_sat')}</div>
              <div className="text-white/70 text-sm">{t('hours_range')}</div>
            </div>
            <div>
              <div className="font-semibold text-base mb-1">{t('sunday')}</div>
              <div className="text-white/70 text-sm">{t('closed')}</div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl px-6 py-6 text-center">
            <div className="section-label justify-center mb-4 text-sm">{t('reservation')}</div>
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
