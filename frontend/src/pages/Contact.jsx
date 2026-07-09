import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [settings, setSettings] = useState({});
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const rows = [
    ['Phone', settings.contact_phone],
    ['Email', settings.contact_email],
    ['Address', settings.address],
    ['Hours', settings.opening_hours],
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="section-label mb-4">Contact Us</div>
      <h1 className="font-display text-3xl mb-8">Get In Touch</h1>
      <dl className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-5 py-4 text-sm">
            <dt className="text-ink/50">{label}</dt>
            <dd className="text-ink font-medium">{value || 'TBD'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
