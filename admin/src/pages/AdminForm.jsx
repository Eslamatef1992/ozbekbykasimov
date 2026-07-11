import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { ArrowLeft } from 'lucide-react';

const PERMISSIONS = [
  ['menu', 'perm_menu'],
  ['orders', 'perm_orders'],
  ['reservations', 'perm_reservations'],
  ['coupons', 'perm_coupons'],
  ['cms', 'perm_cms'],
  ['extras', 'perm_extras'],
  ['admins', 'perm_admins'],
];

const emptyForm = { full_name: '', email: '', phone: '', password: '', role: 'staff', permissions: [] };

export default function AdminForm() {
  const { t } = useI18n();
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get('/users/admins').then((res) => {
      const admin = res.data.find((a) => String(a.id) === String(id));
      if (admin) {
        setForm({
          full_name: admin.full_name, email: admin.email, phone: admin.phone || '', password: '',
          role: admin.role, permissions: admin.permissions || [],
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function togglePermission(key) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key) ? f.permissions.filter((p) => p !== key) : [...f.permissions, key],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        await api.patch(`/users/${id}/permissions`, { role: form.role, permissions: form.permissions });
      } else {
        await api.post('/users/admins', form);
      }
      navigate('/admins');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save admin account');
    }
  }

  if (loading) return <div className="text-muted text-sm">{t('loading')}</div>;

  return (
    <div>
      <Link to="/admins" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest mb-4">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t('back_to_admins')}
      </Link>
      <h1 className="page-title mb-6">{isEdit ? t('edit_admin_rules') : t('create_admin')}</h1>

      <form onSubmit={handleSubmit} className="card card-pad space-y-5 max-w-2xl">
        {!isEdit && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">{t('full_name')}</label>
              <input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label">{t('email')}</label>
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label">{t('phone')}</label>
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label">{t('password')}</label>
              <input required type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="field" />
            </div>
          </div>
        )}
        {isEdit && (
          <div className="bg-surface rounded-xl px-3.5 py-2.5 text-sm text-ink">
            {t('editing_rules_for')} <span className="font-medium">{form.full_name}</span> ({form.email})
          </div>
        )}

        <div>
          <label className="field-label">{t('role')}</label>
          <select value={form.role} onChange={(e) => update('role', e.target.value)} className="field">
            <option value="staff">{t('role_staff_desc')}</option>
            <option value="admin">{t('role_admin_desc')}</option>
          </select>
        </div>

        {form.role === 'staff' && (
          <div>
            <label className="field-label mb-2">{t('rules_desc')}</label>
            <div className="grid sm:grid-cols-2 gap-2 bg-surface rounded-xl p-3.5">
              {PERMISSIONS.map(([key, labelKey]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.permissions.includes(key)} onChange={() => togglePermission(key)} className="accent-forest w-4 h-4" />
                  {t(labelKey)}
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <p className="badge-danger">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button className="btn-primary">{isEdit ? t('save_rules') : t('create_admin')}</button>
          <Link to="/admins" className="btn-ghost">{t('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
