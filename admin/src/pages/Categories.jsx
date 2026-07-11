import { useEffect, useState } from 'react';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';
import { ImagePlus, Pencil, Power, Trash2, LayoutGrid } from 'lucide-react';

const emptyForm = { id: null, name: '', name_ar: '', image_url: '', sort_order: 0, is_active: true };

export default function Categories() {
  const { t } = useI18n();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/categories?all=true').then((res) => setCategories(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(c) {
    setForm({ id: c.id, name: c.name, name_ar: c.name_ar || '', image_url: c.image_url || '', sort_order: c.sort_order || 0, is_active: !!c.is_active });
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
        await api.patch(`/categories/${form.id}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category');
    }
  }

  async function toggleActive(cat) {
    await api.patch(`/categories/${cat.id}`, { name: cat.name, name_ar: cat.name_ar, image_url: cat.image_url, sort_order: cat.sort_order, is_active: !cat.is_active });
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
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('categories_title')}</h1>
          <p className="page-subtitle">{t('categories_sub')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad mb-8 space-y-4 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('english_name')}</label>
            <input required placeholder="e.g. Salads" value={form.name} onChange={(e) => update('name', e.target.value)} className="field" />
          </div>
          <div>
            <label className="field-label">{t('arabic_name')}</label>
            <input placeholder="مثال: سلطات" dir="rtl" value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} className="field" />
          </div>
        </div>

        <div>
          <label className="field-label">{t('category_image')}</label>
          <div className="flex items-center gap-3">
            {form.image_url ? (
              <img src={resolveImageUrl(form.image_url)} alt="" className="w-14 h-14 rounded-full object-cover border border-line" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-muted">
                <ImagePlus size={18} />
              </div>
            )}
            <label className="btn-secondary cursor-pointer">
              {uploading ? t('uploading') : t('choose_image')}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        </div>

        {error && <p className="badge-danger">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button className="btn-primary">{form.id ? t('update_category') : t('add_category')}</button>
          {form.id && <button type="button" onClick={() => setForm(emptyForm)} className="btn-ghost">{t('cancel')}</button>}
        </div>
      </form>

      <div className="card overflow-hidden">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div className="flex items-center gap-3">
              {c.image_url ? (
                <img src={resolveImageUrl(c.image_url)} alt="" className="w-10 h-10 rounded-full object-cover border border-line shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface shrink-0" />
              )}
              <span className={c.is_active ? 'text-ink text-sm' : 'line-through text-muted text-sm'}>{c.name}{c.name_ar ? ` / ${c.name_ar}` : ''}</span>
              {!c.is_active && <span className="badge-neutral">{t('inactive')}</span>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => edit(c)} className="btn-icon" aria-label={t('edit')}><Pencil size={15} /></button>
              <button onClick={() => toggleActive(c)} className="btn-icon" aria-label="Toggle active"><Power size={15} /></button>
              <button onClick={() => remove(c.id)} className="btn-icon hover:text-danger" aria-label={t('delete')}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="empty-state">
            <LayoutGrid size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_categories_yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
