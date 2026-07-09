import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function load() {
    api.get('/categories?all=true').then((res) => setCategories(res.data));
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create category');
    }
  }

  async function toggleActive(cat) {
    await api.patch(`/categories/${cat.id}`, { name: cat.name, sort_order: cat.sort_order, is_active: !cat.is_active });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this category? Menu items in it must be removed first.')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete category');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input required placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 flex-1 max-w-xs" />
        <button className="bg-accent text-white px-4 py-2 rounded-lg">Add</button>
      </form>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-navy/10 divide-y">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <span className={c.is_active ? '' : 'line-through text-navy/40'}>{c.name}</span>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggleActive(c)} className="text-navy/60 hover:text-accent">
                {c.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="px-5 py-4 text-navy/50">No categories yet.</p>}
      </div>
    </div>
  );
}
