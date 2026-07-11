import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';
import CountUp from '../components/CountUp';
import {
  ShoppingBag, Clock, Coins, CalendarCheck, UtensilsCrossed, LayoutGrid, Layers,
  Users, Printer, TrendingUp,
} from 'lucide-react';

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

const RANGES = [
  ['today', 'range_today'],
  ['week', 'range_week'],
  ['month', 'range_month'],
  ['all', 'range_all'],
  ['custom', 'range_custom'],
];

function rangeToDates(range, customFrom, customTo) {
  const now = new Date();
  if (range === 'today') return { from: toISODate(now), to: toISODate(now) };
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    return { from: toISODate(start), to: toISODate(now) };
  }
  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: toISODate(start), to: toISODate(now) };
  }
  if (range === 'custom') return { from: customFrom, to: customTo };
  return { from: '', to: '' };
}

export default function Dashboard() {
  const { t } = useI18n();
  const [range, setRange] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { from, to } = useMemo(() => rangeToDates(range, customFrom, customTo), [range, customFrom, customTo]);

  useEffect(() => {
    if (range === 'custom' && (!customFrom || !customTo)) return;
    setLoading(true);
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    api.get('/stats', { params }).then((res) => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [from, to, range, customFrom, customTo]);

  const cards = stats ? [
    ['stat_orders', stats.orders, ShoppingBag, 'bg-forest-light text-forest'],
    ['stat_pending_orders', stats.pendingOrders, Clock, 'bg-warning/10 text-warning'],
    ['stat_revenue', Number(stats.revenue).toFixed(0), Coins, 'bg-success/10 text-success'],
    ['stat_reservations', stats.reservations, CalendarCheck, 'bg-forest-light text-forest'],
    ['stat_menu_items', stats.menuItems, UtensilsCrossed, 'bg-surface text-ink'],
    ['stat_categories', stats.categories, LayoutGrid, 'bg-surface text-ink'],
    ['stat_extras', stats.extras, Layers, 'bg-surface text-ink'],
    ['stat_customers', stats.customers, Users, 'bg-surface text-ink'],
  ] : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('nav_dashboard')}</h1>
          <p className="page-subtitle">{t('dashboard_sub')}</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary no-print">
          <Printer size={16} /> {t('print_report')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 no-print">
        {RANGES.map(([key, labelKey]) => (
          <button key={key} onClick={() => setRange(key)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition ${range === key ? 'bg-forest text-white border-forest' : 'bg-white border-line text-muted hover:border-forest/40 hover:text-ink'}`}>
            {t(labelKey)}
          </button>
        ))}
        {range === 'custom' && (
          <div className="flex items-center gap-2 ml-1 rtl:ml-0 rtl:mr-1">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="field py-1.5 w-auto" />
            <span className="text-muted text-sm">{t('to')}</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="field py-1.5 w-auto" />
          </div>
        )}
      </div>

      <div className="hidden print:block mb-4 text-sm text-muted">
        {t('report_range')}: {range === 'all' ? t('range_all') : `${from || '—'} ${t('to')} ${to || '—'}`}
      </div>

      {loading || !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card card-pad h-[92px] animate-pulse bg-line/40" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map(([labelKey, value, Icon, tint], idx) => (
              <div key={labelKey}
                className="card card-pad hover:shadow-pop transition-shadow"
                style={{ animation: 'fadeInUp .4s ease-out both', animationDelay: `${idx * 40}ms` }}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}>
                  <Icon size={17} strokeWidth={2} />
                </div>
                <div className="text-sm text-muted">{t(labelKey)}</div>
                <div className="text-2xl font-semibold mt-0.5 text-ink">
                  <CountUp value={value} />
                </div>
              </div>
            ))}
          </div>

          <div className="card card-pad" style={{ animation: 'fadeInUp .4s ease-out both', animationDelay: '320ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-forest" />
              <h2 className="font-semibold text-ink">{t('most_selling_items')}</h2>
            </div>
            {stats.topSelling.length === 0 ? (
              <p className="text-sm text-muted py-6 text-center">{t('no_sales_range')}</p>
            ) : (
              <div className="divide-y divide-line">
                {stats.topSelling.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <span className="text-muted text-sm w-5 font-medium">{idx + 1}</span>
                    {item.image_url ? (
                      <img src={resolveImageUrl(item.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover border border-line" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface" />
                    )}
                    <span className="flex-1 text-ink text-sm">{item.name}</span>
                    <span className="badge-forest">{item.qty} {t('sold')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
