import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);

  function load() {
    api.get('/users').then((res) => setUsers(res.data));
  }
  useEffect(load, []);

  async function toggleActive(u) {
    await api.patch(`/users/${u.id}/active`, { is_active: !u.is_active });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Users</h1>
      <div className="bg-white rounded-xl border border-navy/10 divide-y">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <div className={u.is_active ? '' : 'text-navy/40'}>{u.full_name} <span className="text-navy/40 text-sm">({u.role})</span></div>
              <div className="text-sm text-navy/60">{u.email}</div>
            </div>
            <button onClick={() => toggleActive(u)} className="text-sm text-navy/60 hover:text-accent">
              {u.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="px-5 py-4 text-navy/50">No users found.</p>}
      </div>
    </div>
  );
}
