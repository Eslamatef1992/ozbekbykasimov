import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';
import { ArrowLeft, ImagePlus, X, AlertTriangle, Layers } from 'lucide-react';

const emptyForm = {
  id: null, category_id: '', name: '', name_ar: '', description: '', description_ar: '',
  price: '', image_url: '', sub_images: [], has_extras: false, extra_ids: [],
  is_featured: false, is_available: true,
};

export default function MenuItemForm() {
  const { t } = useI18n();
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [extras, setExtras] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [justUploaded, setJustUploaded] = useState(false);

  useEffect(() => {
    api.get('/categories?all=true').then((res) => setCategories(res.data));
    api.get('/extras?all=true').then((res) => setExtras(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) { setForm(emptyForm); return; }
    setLoading(true);
    api.get(`/menu/${id}`).then(({ data: full }) => {
      setForm({
        id: full.id, category_id: full.category_id, name: full.name, name_ar: full.name_ar || '',
        description: full.description || '', description_ar: full.description_ar || '',
        price: full.price, image_url: full.image_url || '',
        sub_images: (full.images || []).map((i) => i.image_url),
        has_extras: !!full.has_extras, extra_ids: (full.extras || []).map((e) => e.id),
        is_featured: !!full.is_featured, is_available: !!full.is_available,
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleExtra(extraId) {
    setForm((f) => ({
      ...f,
      extra_ids: f.extra_ids.includes(extraId) ? f.extra_ids.filter((e) => e !== extraId) : [...f.extra_ids, extraId],
    }));
  }

  async function handleMainUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading('main');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('image_url', data.url);
      setJustUploaded(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading('');
    }
  }

  async function handleSubUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading('sub');
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const { data } = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(data.url);
      }
      setForm((f) => ({ ...f, sub_images: [...f.sub_images, ...urls] }));
      setJustUploaded(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading('');
    }
  }

  function removeSubImage(url) {
    setForm((f) => ({ ...f, sub_images: f.sub_images.filter((u) => u !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) await api.patch(`/menu/${id}`, form);
      else await api.post('/menu', form);
      navigate('/menu-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save menu item');
    }
  }

  if (loading) return <div className="text-muted text-sm">{t('loading')}</div>;

  return (
    <div>
      <Link to="/menu-items" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest mb-4">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t('back_to_menu_items')}
      </Link>
      <h1 className="page-title mb-6">{isEdit ? t('edit_menu_item') : t('add_menu_item')}</h1>

      <form onSubmit={handleSubmit} className="card card-pad space-y-5 max-w-3xl">
        {justUploaded && (
          <div className="flex items-center gap-2 bg-warning/10 text-warning text-sm rounded-xl px-3.5 py-2.5">
            <AlertTriangle size={15} className="shrink-0" />
            {t('photo_uploaded_warning', { action: isEdit ? t('update_item') : t('add_item') })}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('category')}</label>
            <select required value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className="field">
              <option value="">{t('select_category')}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">{t('price_kd')}</label>
            <input required type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => update('price', e.target.value)} className="field" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('english_name')}</label>
            <input required placeholder="English Name" value={form.name} onChange={(e) => update('name', e.target.value)} className="field" />
          </div>
          <div>
            <label className="field-label">{t('arabic_name')}</label>
            <input placeholder="الاسم بالعربية" dir="rtl" value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} className="field" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('english_description')}</label>
            <textarea placeholder="English Description" value={form.description} onChange={(e) => update('description', e.target.value)} className="field" rows={3} />
          </div>
          <div>
            <label className="field-label">{t('arabic_description')}</label>
            <textarea placeholder="الوصف بالعربية" dir="rtl" value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} className="field" rows={3} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('main_image')}</label>
            <div className="flex items-center gap-3">
              {form.image_url ? (
                <img src={resolveImageUrl(form.image_url)} alt="" className="w-14 h-14 rounded-lg object-cover border border-line" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center text-muted"><ImagePlus size={18} /></div>
              )}
              <label className="btn-secondary cursor-pointer text-sm">
                {uploading === 'main' ? t('uploading') : t('choose_image')}
                <input type="file" accept="image/*" onChange={handleMainUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="field-label">{t('sub_images')}</label>
            <div className="flex flex-wrap items-center gap-2">
              {form.sub_images.map((url) => (
                <div key={url} className="relative">
                  <img src={resolveImageUrl(url)} alt="" className="w-14 h-14 rounded-lg object-cover border border-line" />
                  <button type="button" onClick={() => removeSubImage(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center">
                    <X size={11} />
                  </button>
                </div>
              ))}
              <label className="btn-secondary cursor-pointer text-sm">
                {uploading === 'sub' ? t('uploading') : t('add_photos')}
                <input type="file" accept="image/*" multiple onChange={handleSubUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-ink mb-3">
            <input type="checkbox" checked={form.has_extras} onChange={(e) => update('has_extras', e.target.checked)} className="accent-forest w-4 h-4" />
            <Layers size={15} /> {t('has_extras')}
          </label>
          {form.has_extras && (
            extras.length === 0 ? (
              <p className="text-sm text-muted">{t('no_extras_created')}</p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-2 bg-surface rounded-xl p-3.5">
                {extras.map((x) => (
                  <label key={x.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.extra_ids.includes(x.id)} onChange={() => toggleExtra(x.id)} className="accent-forest w-4 h-4" />
                    {x.name_en} <span className="text-muted">({Number(x.price).toFixed(2)} Kd)</span>
                  </label>
                ))}
              </div>
            )
          )}
        </div>

        <div className="flex gap-6 border-t border-line pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="accent-forest w-4 h-4" /> {t('featured')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_available} onChange={(e) => update('is_available', e.target.checked)} className="accent-forest w-4 h-4" /> {t('available')}
          </label>
        </div>

        {error && <p className="badge-danger">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button className="btn-primary">{isEdit ? t('update_item') : t('add_item')}</button>
          <Link to="/menu-items" className="btn-ghost">{t('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
