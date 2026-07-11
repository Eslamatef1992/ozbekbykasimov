import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DishCard from '../components/DishCard';
import categoryIcon from '../utils/categoryIcons';
import { IconSearch } from '../components/icons';
import { useI18n } from '../context/I18nContext';
import { resolveImageUrl } from '../utils/media';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || '';
  const { t, locale } = useI18n();

  useEffect(() => { api.get('/categories').then((res) => setCategories(res.data)); }, []);
  useEffect(() => {
    const query = {};
    if (activeCategory) query.category = activeCategory;
    if (search) query.search = search;
    api.get('/menu', { params: query }).then((res) => setItems(res.data));
  }, [activeCategory, search]);

  const activeCategoryObj = categories.find((c) => String(c.id) === String(activeCategory));
  const catName = (c) => (locale === 'ar' && c.name_ar) ? c.name_ar : c.name;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="text-sm text-ink/50 mb-8">
        <Link to="/menu" className="hover:text-forest">{t('menu_title')}</Link>
        <span className="mx-1.5">&gt;</span>
        <span>{t('categories')}</span>
        {activeCategoryObj && <><span className="mx-1.5">&gt;</span><span className="text-ink/70">{catName(activeCategoryObj)}</span></>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="page-heading">{activeCategoryObj ? catName(activeCategoryObj) : t('menu_title')}</h1>
        <div className="relative w-full sm:w-72">
          <IconSearch className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search_by_item')}
            className="field pl-11 rtl:pl-4 rtl:pr-11"
          />
        </div>
      </div>

      <div className="flex gap-7 overflow-x-auto pb-2 mb-12 -mx-1 px-1">
        <button
          onClick={() => setParams({})}
          className="flex flex-col items-center gap-2.5 flex-shrink-0 w-20"
        >
          <span className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${!activeCategory ? 'bg-forest' : 'bg-tag'}`}>
            🍽️
          </span>
          <span className={`text-sm ${!activeCategory ? 'text-forest font-medium' : 'text-ink/60'}`}>{t('all')}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParams({ category: c.id })}
            className="flex flex-col items-center gap-2.5 flex-shrink-0 w-20"
          >
            <span className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl overflow-hidden ${String(activeCategory) === String(c.id) ? 'ring-2 ring-forest bg-tag' : 'bg-tag'}`}>
              {c.image_url ? (
                <img src={resolveImageUrl(c.image_url)} alt="" className="w-full h-full object-cover" />
              ) : categoryIcon(c.slug)}
            </span>
            <span className={`text-sm text-center ${String(activeCategory) === String(c.id) ? 'text-forest font-medium' : 'text-ink/60'}`}>{catName(c)}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => <DishCard key={item.id} item={item} />)}
        {items.length === 0 && <p className="text-ink/40 col-span-full text-center py-10">{t('no_dishes_found')}</p>}
      </div>
    </div>
  );
}
