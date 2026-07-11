import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Lock, Mail, Languages } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { t, locale, toggleLocale } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-dark px-4 relative">
      <button onClick={toggleLocale} className="absolute top-5 right-5 rtl:right-auto rtl:left-5 btn-secondary py-1.5 px-3 text-xs" aria-label="Toggle language">
        <Languages size={14} /> {locale === 'en' ? 'العربية' : 'English'}
      </button>
      <form onSubmit={handleSubmit} className="card card-pad w-full max-w-sm space-y-5">
        <div className="text-center mb-1">
          <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-10 w-auto mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-ink">{t('admin_login')}</h1>
          <p className="text-sm text-muted mt-1">{t('admin_login_sub')}</p>
        </div>

        <div>
          <label className="field-label">{t('email')}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input required type="email" placeholder="you@ozbekbykasimov.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className="field pl-10 rtl:pl-3.5 rtl:pr-10" />
          </div>
        </div>

        <div>
          <label className="field-label">{t('password')}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input required type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} className="field pl-10 rtl:pl-3.5 rtl:pr-10" />
          </div>
        </div>

        {error && <p className="badge-danger">{error}</p>}

        <button disabled={loading} className="btn-primary w-full">{loading ? t('signing_in') : t('log_in')}</button>
      </form>
    </div>
  );
}
