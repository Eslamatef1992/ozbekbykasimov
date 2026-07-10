import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useI18n } from '../context/I18nContext';
import { resolveImageUrl } from '../utils/media';

export default function DishCard({ item }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { openAuth } = useUI();
  const { t } = useI18n();

  async function handleAdd(e) {
    e.preventDefault();
    if (!user) { openAuth('login'); return; }
    await addItem(item.id, 1);
  }

  return (
    <Link to={`/menu/${item.slug}`} className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition">
      <div className="aspect-[4/3] bg-mint overflow-hidden">
        {item.image_url && <img src={resolveImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <span className="inline-block bg-tag text-forest text-xs px-3 py-1 rounded-full w-fit mb-3">
          {item.category_name || 'Main Meal'}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-ink text-base">{item.name}</span>
          <span className="text-ink text-base font-medium whitespace-nowrap">{Number(item.price).toFixed(0)} Kd</span>
        </div>
        {item.description && (
          <p className="text-sm text-ink/50 mt-1.5 line-clamp-2">{item.description}</p>
        )}
        <button onClick={handleAdd} disabled={!item.is_available} className="btn-primary mt-4 disabled:opacity-50">
          {item.is_available ? t('add_to_cart') : t('unavailable')}
        </button>
      </div>
    </Link>
  );
}
