import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');
  const { user } = useAuth();
  const { addItem } = useCart();
  const { openAuth } = useUI();

  useEffect(() => { api.get(`/menu/${slug}`).then((res) => setItem(res.data)); }, [slug]);

  async function handleAddToCart() {
    if (!user) { openAuth('login'); return; }
    await addItem(item.id, quantity);
    setStatus('Added to cart');
  }

  if (!item) return <div className="max-w-6xl mx-auto px-6 py-16">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded-2xl bg-mint overflow-hidden">
        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div>
        <span className="inline-block bg-tag text-forest text-xs px-3 py-1 rounded-full">{item.category_name}</span>
        <h1 className="font-display text-3xl mt-3">{item.name}</h1>
        <p className="text-ink/60 mt-4">{item.description}</p>
        <div className="text-2xl text-forest font-medium mt-6">{Number(item.price).toFixed(0)} Kd</div>

        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center border border-ink/15 rounded-full">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1.5">-</button>
            <span className="px-3">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1.5">+</button>
          </div>
          <button onClick={handleAddToCart} disabled={!item.is_available} className="btn-primary disabled:opacity-50">
            {item.is_available ? 'Add To Cart' : 'Unavailable'}
          </button>
        </div>
        {status && <p className="text-sm text-forest mt-3">{status}</p>}
      </div>
    </div>
  );
}
