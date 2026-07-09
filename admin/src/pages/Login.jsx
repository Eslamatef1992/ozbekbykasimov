import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-navy">Ozbek Admin</h1>
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-accent text-white px-6 py-2.5 rounded-lg w-full">Log In</button>
      </form>
    </div>
  );
}
