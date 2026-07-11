import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { openReceipt } from '../utils/receipt';
import { Users as UsersIcon, Power, Printer } from 'lucide-react';

function addressOf(u) {
  const parts = [];
  if (u.block_number) parts.push(`Block ${u.block_number}`);
  if (u.street_name) parts.push(u.street_name);
  if (u.building_number) parts.push(`Bldg ${u.building_number}`);
  if (u.floor) parts.push(`Floor ${u.floor}`);
  if (u.flat) parts.push(`Flat ${u.flat}`);
  if (u.region) parts.push(u.region);
  return parts.length ? parts.join(', ') : '—';
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString();
}

function printUser(u) {
  openReceipt({
    title: u.full_name,
    subtitle: 'Customer Profile',
    rows: [
      ['Name', u.full_name],
      ['Email', u.email],
      ['Mobile Number', u.phone],
      ['Address', addressOf(u)],
      ['Date of Join', fmtDate(u.created_at)],
      ['No. of Orders', u.order_count ?? 0],
      ['No. of Table Booking Requests', u.reservation_count ?? 0],
      ['Status', u.is_active ? 'Active' : 'Inactive'],
    ],
    showThanks: false,
  });
}

export default function Users() {
  const { t } = useI18n();
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
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('users_title')}</h1>
          <p className="page-subtitle">{users.length} {t('users_sub_count')}</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary no-print">
          <Printer size={16} /> {t('print_report')}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('col_customer')}</th>
              <th>{t('email_address')}</th>
              <th>{t('col_mobile')}</th>
              <th>{t('col_address')}</th>
              <th>{t('col_date_of_join')}</th>
              <th>{t('col_no_orders')}</th>
              <th>{t('col_no_bookings')}</th>
              <th className="no-print">{t('col_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap">
                  <span className={u.is_active ? 'text-ink' : 'text-muted line-through'}>{u.full_name}</span>
                  {!u.is_active && <span className="badge-neutral ml-2 rtl:ml-0 rtl:mr-2">{t('inactive')}</span>}
                </td>
                <td className="whitespace-nowrap">{u.email}</td>
                <td className="whitespace-nowrap">{u.phone || '—'}</td>
                <td className="max-w-[220px]">{addressOf(u)}</td>
                <td className="whitespace-nowrap text-sm">{fmtDate(u.created_at)}</td>
                <td><span className="badge-forest">{u.order_count ?? 0}</span></td>
                <td><span className="badge-forest">{u.reservation_count ?? 0}</span></td>
                <td className="no-print">
                  <div className="flex gap-1">
                    <button onClick={() => printUser(u)} className="btn-icon" aria-label={t('print')}><Printer size={15} /></button>
                    <button onClick={() => toggleActive(u)} className="btn-icon" aria-label="Toggle active"><Power size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="empty-state">
            <UsersIcon size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_users_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
