import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, reservations: 0, menuItems: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/reservations'),
      api.get('/menu?all=true'),
      api.get('/users'),
    ]).then(([orders, reservations, menu, users]) => {
      setStats({
        orders: orders.data.length,
        reservations: reservations.data.length,
        menuItems: menu.data.length,
        users: users.data.length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    ['Orders', stats.orders],
    ['Reservations', stats.reservations],
    ['Menu Items', stats.menuItems],
    ['Users', stats.users],
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl border border-navy/10 p-5">
            <div className="text-sm text-navy/60">{label}</div>
            <div className="text-3xl font-semibold mt-1">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
