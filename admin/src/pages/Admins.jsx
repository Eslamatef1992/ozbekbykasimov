import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Plus, ShieldCheck } from 'lucide-react';

export default function Admins() {
  const { user: me } = useAuth();
  const { t } = useI18n();
  const [admins, setAdmins] = useState([]);

  function load() {
    api.get('/users/admins').then((res) => setAdmins(res.data));
  }
  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('admins_title')}</h1>
          <p className="page-subtitle">{t('admins_sub')}</p>
        </div>
        <Link to="/admins/new" className="btn-primary"><Plus size={16} /> {t('create_admin')}</Link>
      </div>

      <div className="card overflow-hidden">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div>
              <div className="text-sm text-ink flex items-center gap-2">
                {a.full_name}
                <span className="badge-neutral capitalize">{a.role}</span>
                {a.id === me?.id && <span className="badge-forest">{t('you')}</span>}
              </div>
              <div className="text-sm text-muted mt-0.5">{a.email}</div>
              {a.role === 'staff' && (
                <div className="text-xs text-muted/80 mt-1">
                  {a.permissions?.length ? a.permissions.join(', ') : t('no_rules_assigned')}
                </div>
              )}
            </div>
            <Link to={`/admins/${a.id}/edit`} className="btn-secondary text-sm">{t('edit_rules')}</Link>
          </div>
        ))}
        {admins.length === 0 && (
          <div className="empty-state">
            <ShieldCheck size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_admin_accounts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
