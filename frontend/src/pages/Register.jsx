import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-3xl mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-accent text-white px-6 py-3 rounded-full w-full">Create Account</button>
      </form>
      <p className="text-sm text-navy/60 mt-6">Already have an account? <Link to="/login" className="text-accent">Log in</Link></p>
    </div>
  );
}
