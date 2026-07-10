import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useI18n } from '../context/I18nContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');
  const { user } = useAuth();
  const { addItem } = useCart();
  const { openAuth } = useUI();
  const { t } = useI18n();

  useEffect(() => { api.get(`/menu/${slug}`).then((res) => setItem(res.data)); }, [slug]);

  async function handleAddToCart() {
    if (!user) { openAuth('login'); return; }
    await addItem(item.id, quantity);
    setStatus(t('added_to_cart'));
  }

  if (!item) return <div className="max-w-6xl mx-auto px-6 py-16 text-lg text-ink/60">{t('loading')}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-14">
      <div className="aspect-square rounded-2xl bg-mint overflow-hidden">
        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div>
        <span className="inline-block bg-tag text-forest text-sm px-3.5 py-1.5 rounded-full">{item.category_name}</span>
        <h1 className="font-display text-4xl mt-4">{item.name}</h1>
        <p className="text-ink/60 text-lg mt-5">{item.description}</p>
        <div className="text-3xl text-forest font-medium mt-7">{Number(item.price).toFixed(0)} Kd</div>

        <div className="flex items-center gap-5 mt-9">
          <div className="flex items-center border border-ink/15 rounded-full">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3.5 py-2 text-lg">-</button>
            <span className="px-3.5 text-lg">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3.5 py-2 text-lg">+</button>
          </div>
          <button onClick={handleAddToCart} disabled={!item.is_available} className="btn-primary disabled:opacity-50">
            {item.is_available ? t('add_to_cart') : t('unavailable')}
          </button>
        </div>
        {status && <p className="text-base text-forest mt-4">{status}</p>}
      </div>
    </div>
  );
}
