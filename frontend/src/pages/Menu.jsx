import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DishCard from '../components/DishCard';
import categoryIcon from '../utils/categoryIcons';
import { IconSearch } from '../components/icons';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || '';

  useEffect(() => { api.get('/categories').then((res) => setCategories(res.data)); }, []);
  useEffect(() => {
    const query = {};
    if (activeCategory) query.category = activeCategory;
    if (search) query.search = search;
    api.get('/menu', { params: query }).then((res) => setItems(res.data));
  }, [activeCategory, search]);

  const activeCategoryObj = categories.find((c) => String(c.id) === String(activeCategory));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-xs text-ink/50 mb-6">
        <Link to="/menu" className="hover:text-forest">Menu</Link>
        <span className="mx-1">&gt;</span>
        <span>Categories</span>
        {activeCategoryObj && <><span className="mx-1">&gt;</span><span className="text-ink/70">{activeCategoryObj.name}</span></>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="section-label">{activeCategoryObj ? activeCategoryObj.name : 'Menu'}</div>
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Item"
            className="field pl-9"
          />
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 mb-10 -mx-1 px-1">
        <button
          onClick={() => setParams({})}
          className="flex flex-col items-center gap-2 flex-shrink-0 w-16"
        >
          <span className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${!activeCategory ? 'bg-forest' : 'bg-tag'}`}>
            🍽️
          </span>
          <span className={`text-xs ${!activeCategory ? 'text-forest font-medium' : 'text-ink/60'}`}>All</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParams({ category: c.id })}
            className="flex flex-col items-center gap-2 flex-shrink-0 w-16"
          >
            <span className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${String(activeCategory) === String(c.id) ? 'ring-2 ring-forest bg-tag' : 'bg-tag'}`}>
              {categoryIcon(c.slug)}
            </span>
            <span className={`text-xs text-center ${String(activeCategory) === String(c.id) ? 'text-forest font-medium' : 'text-ink/60'}`}>{c.name}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => <DishCard key={item.id} item={item} />)}
        {items.length === 0 && <p className="text-ink/40 col-span-full text-center py-10">No dishes found.</p>}
      </div>
    </div>
  );
}
