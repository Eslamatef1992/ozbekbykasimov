import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { IconClose, IconEye } from './icons';

export default function AuthDrawer() {
  const { authOpen, authMode, closeAuth, setAuthMode } = useUI();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '', terms: false });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function reset() {
    setForm({ full_name: '', email: '', phone: '', password: '', confirm: '', terms: false });
    setError('');
  }

  function handleClose() {
    reset();
    closeAuth();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      handleClose();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!form.terms) { setError('Please confirm the Terms & Conditions'); return; }
    setSubmitting(true);
    try {
      await register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      handleClose();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!authOpen) return null;
  const isLogin = authMode === 'login';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl animate-[slideIn_.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-sm text-ink/60">{isLogin ? 'Log In' : 'Create Account'}</span>
          <button onClick={handleClose} aria-label="Close" className="text-ink/50 hover:text-ink"><IconClose /></button>
        </div>

        <div className="px-6 py-8">
          <h2 className="font-display text-2xl tracking-wide mb-6">{isLogin ? 'LOGIN INFO' : 'CREATE ACCOUNT'}</h2>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Email" required>
                <input required type="email" placeholder="Enter Mail" value={form.email}
                  onChange={(e) => update('email', e.target.value)} className="field" />
              </Field>
              <Field label="Password" required>
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Enter Password" value={form.password}
                    onChange={(e) => update('password', e.target.value)} className="field pr-10" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                    <IconEye off={showPassword} />
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button type="button" className="text-xs text-ink/50 hover:text-forest underline">Forget Password ?</button>
                </div>
              </Field>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Logging in...' : 'Log In'}</button>
              <p className="text-center text-sm text-ink/60">
                Don't Have An Account ?{' '}
                <button type="button" onClick={() => setAuthMode('register')} className="text-forest font-medium underline">Create Account</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <Field label="Name" required>
                <input required placeholder="Enter Name" value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)} className="field" />
              </Field>
              <Field label="Email" required>
                <input required type="email" placeholder="Enter Mail" value={form.email}
                  onChange={(e) => update('email', e.target.value)} className="field" />
              </Field>
              <Field label="Phone Number" required>
                <div className="flex">
                  <span className="flex items-center gap-1 px-3 border border-r-0 border-ink/15 rounded-l-lg text-sm text-ink/70 bg-mint/40">
                    🇰🇼 +965
                  </span>
                  <input required placeholder="Enter Phone" value={form.phone}
                    onChange={(e) => update('phone', e.target.value)} className="field rounded-l-none" />
                </div>
              </Field>
              <Field label="Password" required>
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Enter Password" value={form.password}
                    onChange={(e) => update('password', e.target.value)} className="field pr-10" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                    <IconEye off={showPassword} />
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" required>
                <div className="relative">
                  <input required type={showConfirm ? 'text' : 'password'} placeholder="Enter Password" value={form.confirm}
                    onChange={(e) => update('confirm', e.target.value)} className="field pr-10" />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                    <IconEye off={showConfirm} />
                  </button>
                </div>
              </Field>

              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} />
                Confirm Terms &amp; Conditions
              </label>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Creating...' : 'Log In'}</button>
              <p className="text-center text-sm text-ink/60">
                Have An Account ?{' '}
                <button type="button" onClick={() => setAuthMode('login')} className="text-forest font-medium underline">Login</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm text-ink mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
