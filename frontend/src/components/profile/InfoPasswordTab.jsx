import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { IconEye } from '../icons';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-base font-medium text-ink mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function InfoPasswordTab() {
  const { user, setUser } = useAuth();
  const { t } = useI18n();

  const [info, setInfo] = useState({ full_name: '', email: '', phone: '' });
  const [infoStatus, setInfoStatus] = useState('');
  const [infoError, setInfoError] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [pw, setPw] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStatus, setPwStatus] = useState('');
  const [pwError, setPwError] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    api.get('/users/me').then((res) => {
      setInfo({ full_name: res.data.full_name || '', email: res.data.email || '', phone: res.data.phone || '' });
    });
  }, []);

  async function saveInfo(e) {
    e.preventDefault();
    setInfoError('');
    setInfoStatus('');
    setSavingInfo(true);
    try {
      const { data } = await api.patch('/users/me', { full_name: info.full_name, phone: info.phone });
      setUser((u) => ({ ...u, ...data }));
      setInfoStatus(t('info_saved'));
    } catch (err) {
      setInfoError(err.response?.data?.message || 'Could not save');
    } finally {
      setSavingInfo(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPwError('');
    setPwStatus('');
    if (!pw.password) return;
    if (pw.password !== pw.confirm) { setPwError('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.patch('/users/me/password', pw);
      setPw({ password: '', confirm: '' });
      setPwStatus(t('password_updated'));
    } catch (err) {
      setPwError(err.response?.data?.message || 'Could not update password');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveInfo} className="bg-white border border-border rounded-2xl p-8">
        <h2 className="font-display text-2xl mb-5 pb-5 border-b border-border">{t('info_title')}</h2>
        <div className="space-y-6">
          <Field label={t('full_name')} required>
            <input required value={info.full_name} onChange={(e) => setInfo((f) => ({ ...f, full_name: e.target.value }))}
              placeholder={t('enter_name')} className="field" />
          </Field>
          <Field label={t('email')} required>
            <input required type="email" value={info.email} disabled
              className="field bg-ink/5 text-ink/50 cursor-not-allowed" />
          </Field>
          <Field label={t('phone_number')} required>
            <div className="flex">
              <span className="flex items-center gap-1.5 px-3 border border-r-0 rtl:border-r rtl:border-l-0 border-ink/15 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg text-base text-ink/70 bg-mint/40">
                🇰🇼 +965
              </span>
              <input required value={info.phone} onChange={(e) => setInfo((f) => ({ ...f, phone: e.target.value }))}
                placeholder={t('enter_phone')} className="field rounded-l-none rtl:rounded-l-lg rtl:rounded-r-none" />
            </div>
          </Field>

          {infoError && <p className="text-red-600 text-base">{infoError}</p>}
          {infoStatus && <p className="text-forest text-base">{infoStatus}</p>}
          <button disabled={savingInfo} className="w-full bg-forest text-white rounded-lg py-3.5 font-medium hover:bg-forest-dark transition disabled:opacity-50">
            {savingInfo ? t('saving') : t('save')}
          </button>
        </div>
      </form>

      <form onSubmit={savePassword} className="bg-white border border-border rounded-2xl p-8">
        <h2 className="font-display text-2xl mb-5 pb-5 border-b border-border">{t('password_security_title')}</h2>
        <div className="space-y-6">
          <Field label={t('new_password')}>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={pw.password}
                onChange={(e) => setPw((f) => ({ ...f, password: e.target.value }))}
                placeholder={t('enter_password')} className="field pr-11 rtl:pr-4 rtl:pl-11" />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-ink/40">
                <IconEye off={showPw} />
              </button>
            </div>
          </Field>
          <Field label={t('confirm_new_password')} required>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={pw.confirm}
                onChange={(e) => setPw((f) => ({ ...f, confirm: e.target.value }))}
                placeholder={t('enter_password')} className="field pr-11 rtl:pr-4 rtl:pl-11" />
              <button type="button" onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-ink/40">
                <IconEye off={showConfirm} />
              </button>
            </div>
          </Field>

          {pwError && <p className="text-red-600 text-base">{pwError}</p>}
          {pwStatus && <p className="text-forest text-base">{pwStatus}</p>}
          <button disabled={savingPw} className="w-full bg-forest text-white rounded-lg py-3.5 font-medium hover:bg-forest-dark transition disabled:opacity-50">
            {savingPw ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
