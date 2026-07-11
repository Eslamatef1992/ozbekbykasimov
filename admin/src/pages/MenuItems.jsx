import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';
import { Plus, Pencil, Trash2, UtensilsCrossed, Star, Layers } from 'lucide-react';

export default function MenuItems() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);

  function load() {
    api.get('/menu?all=true').then((res) => setItems(res.data));
  }
  useEffect(load, []);

  async function remove(id) {
    if (!confirm('Delete this menu item?')) return;
    await api.delete(`/menu/${id}`);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('menu_items_title')}</h1>
          <p className="page-subtitle">{items.length} {t('menu_items_sub_count')}</p>
        </div>
        <Link to="/menu-items/new" className="btn-primary"><Plus size={16} /> {t('add_item')}</Link>
      </div>

      <div className="card overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div className="flex items-center gap-3 min-w-0">
              {item.image_url ? (
                <img src={resolveImageUrl(item.image_url)} alt="" className="w-11 h-11 rounded-lg object-cover border border-line shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-surface shrink-0" />
              )}
              <div className="min-w-0">
                <div className={`text-sm truncate ${item.is_available ? 'text-ink' : 'text-muted line-through'}`}>
                  {item.name} <span className="text-muted font-normal">({item.category_name})</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-ink">{Number(item.price).toFixed(0)} Kd</span>
                  {item.is_featured && <span className="badge-forest"><Star size={11} /> {t('featured')}</span>}
                  {item.has_extras && <span className="badge-neutral"><Layers size={11} /> {t('nav_extras')}</span>}
                  {!item.is_available && <span className="badge-danger">{t('unavailable')}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Link to={`/menu-items/${item.id}/edit`} className="btn-icon" aria-label={t('edit')}><Pencil size={15} /></Link>
              <button onClick={() => remove(item.id)} className="btn-icon hover:text-danger" aria-label={t('delete')}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="empty-state">
            <UtensilsCrossed size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_menu_items_yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
