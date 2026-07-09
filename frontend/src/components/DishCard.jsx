import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function DishCard({ item }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { openAuth } = useUI();

  async function handleAdd(e) {
    e.preventDefault();
    if (!user) { openAuth('login'); return; }
    await addItem(item.id, 1);
  }

  return (
    <Link to={`/menu/${item.slug}`} className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition">
      <div className="aspect-[4/3] bg-mint overflow-hidden">
        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <span className="inline-block bg-tag text-forest text-[11px] px-2.5 py-0.5 rounded-full w-fit mb-2">
          {item.category_name || 'Main Meal'}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-ink">{item.name}</span>
          <span className="text-forest text-sm font-medium whitespace-nowrap">{Number(item.price).toFixed(0)} Kd</span>
        </div>
        {item.description && (
          <p className="text-xs text-ink/50 mt-1 line-clamp-2">{item.description}</p>
        )}
        <button onClick={handleAdd} disabled={!item.is_available} className="btn-primary mt-4 disabled:opacity-50">
          {item.is_available ? 'Add To Cart' : 'Unavailable'}
        </button>
      </div>
    </Link>
  );
}
