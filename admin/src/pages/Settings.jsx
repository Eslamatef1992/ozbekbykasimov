import { useEffect, useState } from 'react';
import api from '../services/api';

const FIELDS = [
  ['site_name', 'Site Name'],
  ['contact_phone', 'Contact Phone'],
  ['contact_email', 'Contact Email'],
  ['address', 'Address'],
  ['opening_hours', 'Opening Hours'],
  ['about_text', 'About Us Text'],
];

export default function Settings() {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/settings').then((res) => setForm(res.data)); }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.put('/settings', form);
    setSaved(true);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-xl p-5 max-w-xl space-y-4">
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm text-navy/60 mb-1">{label}</label>
            {key === 'about_text' ? (
              <textarea value={form[key] || ''} onChange={(e) => update(key, e.target.value)} rows={4} className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
            ) : (
              <input value={form[key] || ''} onChange={(e) => update(key, e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 w-full" />
            )}
          </div>
        ))}
        <button className="bg-accent text-white px-5 py-2 rounded-lg">Save Settings</button>
        {saved && <span className="text-sm text-green-600 ml-3">Saved</span>}
      </form>
    </div>
  );
}
