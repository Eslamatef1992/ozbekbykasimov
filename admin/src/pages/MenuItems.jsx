import { useEffect, useState } from 'react';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';

const emptyForm = { id: null, category_id: '', name: '', description: '', price: '', image_url: '', is_featured: false, is_available: true };

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/menu?all=true').then((res) => setItems(res.data));
    api.get('/categories?all=true').then((res) => setCategories(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(item) {
    setForm({
      id: item.id, category_id: item.category_id, name: item.name, description: item.description || '',
      price: item.price, image_url: item.image_url || '', is_featured: !!item.is_featured, is_available: !!item.is_available,
    });
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('image_url', data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (form.id) {
        await api.patch(`/menu/${form.id}`, form);
      } else {
        await api.post('/menu', form);
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save menu item');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this menu item?')) return;
    await api.delete(`/menu/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Menu Items</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-xl p-5 mb-8 grid md:grid-cols-2 gap-4">
        <select required value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input required placeholder="Name" value={form.name} onChange={(e) => update('name', e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2" />
        <input required type="number" step="0.01" placeholder="Price (Kd)" value={form.price} onChange={(e) => update('price', e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2" />
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <span className="text-sm text-navy/50 ml-2">Uploading...</span>}
          {form.image_url && (
            <div className="flex items-center gap-2 mt-2">
              <img src={resolveImageUrl(form.image_url)} alt="" className="w-14 h-14 rounded-lg object-cover border border-navy/10" />
              <div className="text-xs text-navy/50 break-all">{form.image_url}</div>
            </div>
          )}
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 md:col-span-2" rows={2} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_available} onChange={(e) => update('is_available', e.target.checked)} /> Available
        </label>

        {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button className="bg-accent text-white px-5 py-2 rounded-lg">{form.id ? 'Update Item' : 'Add Item'}</button>
          {form.id && <button type="button" onClick={() => setForm(emptyForm)} className="text-navy/60">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-navy/10 divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              {item.image_url ? (
                <img src={resolveImageUrl(item.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover border border-navy/10 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-navy/5 shrink-0" />
              )}
              <div>
                <div className={item.is_available ? '' : 'text-navy/40'}>{item.name} <span className="text-navy/40 text-sm">({item.category_name})</span></div>
                <div className="text-sm text-navy/60">{Number(item.price).toFixed(0)} Kd{item.is_featured ? ' - Featured' : ''}</div>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => edit(item)} className="text-navy/60 hover:text-accent">Edit</button>
              <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="px-5 py-4 text-navy/50">No menu items yet.</p>}
      </div>
    </div>
  );
}
