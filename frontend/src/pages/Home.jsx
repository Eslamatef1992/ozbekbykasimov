import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DishCard from '../components/DishCard';
import categoryIcon from '../utils/categoryIcons';
import { useI18n } from '../context/I18nContext';
import { resolveImageUrl } from '../utils/media';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const { t, locale } = useI18n();

  useEffect(() => {
    api.get('/menu').then((res) => setFeatured(res.data.filter((i) => i.is_featured).slice(0, 8)));
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="section-heading mb-6">{t('hero_heading')}</h1>
        <p className="text-ink/60 text-lg max-w-xl mx-auto">{t('hero_subtitle')}</p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link to="/menu" className="btn-primary">{t('view_menu')}</Link>
          <Link to="/book-table" className="btn-outline">{t('book_a_table')}</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex justify-center mb-10">
          <div className="section-label">{t('categories')}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {categories.map((c) => (
            <Link key={c.id} to={`/menu?category=${c.id}`} className="flex flex-col items-center gap-3 w-20">
              <span className="w-16 h-16 rounded-full bg-tag flex items-center justify-center text-3xl overflow-hidden">
                {c.image_url ? (
                  <img src={resolveImageUrl(c.image_url)} alt="" className="w-full h-full object-cover" />
                ) : categoryIcon(c.slug)}
              </span>
              <span className="text-sm text-ink/70 text-center">{(locale === 'ar' && c.name_ar) ? c.name_ar : c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-mint/40 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center mb-4">{t('featured_meals')}</div>
            <p className="text-ink/60 max-w-xl mx-auto text-base">{t('featured_meals_sub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((item) => <DishCard key={item.id} item={item} />)}
            {featured.length === 0 && <p className="text-ink/40 col-span-full text-center">Featured dishes will appear here once the menu is populated.</p>}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-forest text-white rounded-2xl px-10 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">{t('explore_full_menu')}</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-9 text-base">{t('explore_full_menu_sub')}</p>
          <Link to="/menu" className="inline-block bg-white text-forest px-7 py-3.5 rounded-full text-base font-medium hover:bg-tag transition">
            {t('view_menu')}
          </Link>
        </div>
      </section>
    </div>
  );
}
