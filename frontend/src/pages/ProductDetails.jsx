import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { IconChevron } from '../components/icons';
import DishCard from '../components/DishCard';
import { resolveImageUrl } from '../utils/media';

const CALORIE_SLOTS = new Array(8).fill('480');

export default function ProductDetails() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [status, setStatus] = useState('');
  const { addItem } = useCart();
  const { t, locale } = useI18n();

  useEffect(() => {
    setItem(null);
    setActiveImage(0);
    setSelectedExtras([]);
    api.get(`/menu/${slug}`).then((res) => setItem(res.data));
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    api.get('/menu', { params: { category: item.category_id } }).then((res) => {
      setRelated(res.data.filter((i) => i.id !== item.id).slice(0, 8));
    });
  }, [item]);

  function toggleExtra(extra) {
    setSelectedExtras((cur) => (
      cur.some((e) => e.id === extra.id) ? cur.filter((e) => e.id !== extra.id) : [...cur, extra]
    ));
  }

  async function handleAddToCart() {
    // Guests can add to cart too (matches "Guest Orders") - CartContext keeps
    // a local cart until they log in or check out as a guest.
    await addItem(item, 1, undefined, selectedExtras);
    setStatus(t('added_to_cart'));
  }

  if (!item) return <div className="max-w-6xl mx-auto px-6 py-16 text-lg text-ink/60">{t('loading')}</div>;

  const displayName = (locale === 'ar' && item.name_ar) ? item.name_ar : item.name;
  const displayDescription = (locale === 'ar' && item.description_ar) ? item.description_ar : item.description;
  const galleryUrls = (item.images || []).map((i) => i.image_url);
  const images = [item.image_url, ...galleryUrls].filter(Boolean).map(resolveImageUrl);
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + Number(e.price || 0), 0);
  const unitTotal = Number(item.price) + extrasTotal;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-2 text-sm text-ink/50 mb-6 flex-wrap">
          <Link to="/menu" className="hover:text-forest">{t('menu_title')}</Link>
          <IconChevron className="rtl:rotate-180" width="14" height="14" />
          <Link to="/menu" className="hover:text-forest">{t('categories')}</Link>
          {item.category_slug && (
            <>
              <IconChevron className="rtl:rotate-180" width="14" height="14" />
              <Link to={`/menu?category=${item.category_id}`} className="hover:text-forest">{item.category_name}</Link>
            </>
          )}
          <IconChevron className="rtl:rotate-180" width="14" height="14" />
          <span className="text-ink font-medium">{item.category_name} {t('details')}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-14">
        <div>
          <div className="aspect-[6/5] rounded-2xl bg-mint overflow-hidden">
            {images[activeImage] && <img src={images[activeImage]} alt={displayName} className="w-full h-full object-cover" />}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`flex-1 aspect-[3/2] rounded-lg overflow-hidden border-2 ${activeImage === idx ? 'border-forest' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="inline-block bg-tag text-forest text-sm px-3.5 py-1.5 rounded-full">{item.category_name}</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-4">
            {displayName} <span className="text-ink/30">•</span> {Number(item.price).toFixed(0)} Kd
          </h1>
          <p className="text-ink/60 text-lg mt-5">{displayDescription}</p>

          <div className="flex items-center gap-4 mt-8 mb-4">
            <span className="h-px w-8 bg-forest/40" />
            <h2 className="font-display text-xl">{t('meal_ingredients')}</h2>
            <span className="h-px w-8 bg-forest/40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-base text-ink/70">
            {CALORIE_SLOTS.map((cal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest/50 shrink-0" />
                {t('calories')} {cal}
              </div>
            ))}
          </div>

          <p className="bg-mint/40 text-ink/70 text-sm text-center rounded-xl px-5 py-4 mt-6">
            &ldquo;{t('nutrition_quote')}&rdquo;
          </p>

          {item.has_extras && item.extras && item.extras.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-xl mb-3">{t('extras')}</h2>
              <div className="space-y-2">
                {item.extras.map((extra) => {
                  const name = (locale === 'ar' && extra.name_ar) ? extra.name_ar : extra.name_en;
                  const checked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <label key={extra.id} className="flex items-center justify-between gap-3 border border-ink/10 rounded-lg px-4 py-2.5 cursor-pointer">
                      <span className="flex items-center gap-2.5 text-base">
                        <input type="checkbox" checked={checked} onChange={() => toggleExtra({ id: extra.id, name_en: extra.name_en, name_ar: extra.name_ar, price: Number(extra.price) })} className="w-4 h-4 accent-forest" />
                        {name}
                      </span>
                      <span className="text-ink/60 text-sm">+{Number(extra.price).toFixed(2)} Kd</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={handleAddToCart} disabled={!item.is_available} className="btn-primary w-full mt-8 disabled:opacity-50">
            {item.is_available ? `${t('add_to_cart')} — ${unitTotal.toFixed(2)} Kd` : t('unavailable')}
          </button>
          {status && <p className="text-base text-forest mt-4">{status}</p>}
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px w-10 bg-forest/40" />
            <h2 className="font-display text-2xl sm:text-3xl text-forest">{t('complementary_dishes')}</h2>
            <span className="h-px w-10 bg-forest/40" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((r) => <DishCard key={r.id} item={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
