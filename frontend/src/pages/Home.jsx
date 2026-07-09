import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DishCard from '../components/DishCard';
import categoryIcon from '../utils/categoryIcons';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/menu').then((res) => setFeatured(res.data.filter((i) => i.is_featured).slice(0, 8)));
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="section-label justify-center mb-4">Where Flavor Meets Elegance</div>
        <p className="text-ink/60 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet consectetur. Dolor elit vitae nunc varius. Facilisis eget cras sit
          semper sit enim. Turpis aliquet at ac eu donec ut.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/menu" className="btn-primary">View Menu</Link>
          <Link to="/book-table" className="btn-outline">Book A Table</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="section-label justify-center mb-8 w-full">
          <span className="mx-auto">Categories</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((c) => (
            <Link key={c.id} to={`/menu?category=${c.id}`} className="flex flex-col items-center gap-2 w-16">
              <span className="w-14 h-14 rounded-full bg-tag flex items-center justify-center text-2xl">
                {categoryIcon(c.slug)}
              </span>
              <span className="text-xs text-ink/70 text-center">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-mint/40 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-3">Featured Meals</div>
            <p className="text-ink/60 max-w-xl mx-auto text-sm">
              Discover our chef's carefully curated selection of signature dishes, each crafted with the
              finest ingredients and exceptional attention to detail.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((item) => <DishCard key={item.id} item={item} />)}
            {featured.length === 0 && <p className="text-ink/40 col-span-full text-center">Featured dishes will appear here once the menu is populated.</p>}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-forest text-white rounded-2xl px-10 py-14 text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-3">Explore Our Complete Menu</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8 text-sm">
            From appetizers to desserts, discover our full range of culinary creations that celebrate the
            flavor of continental cuisine.
          </p>
          <Link to="/menu" className="inline-block bg-white text-forest px-6 py-3 rounded-full text-sm font-medium hover:bg-tag transition">
            View Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
