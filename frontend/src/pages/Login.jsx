import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-3xl mb-8">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-accent text-white px-6 py-3 rounded-full w-full">Log In</button>
      </form>
      <p className="text-sm text-navy/60 mt-6">No account yet? <Link to="/register" className="text-accent">Create one</Link></p>
    </div>
  );
}
