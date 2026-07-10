import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { IconChevron } from '../components/icons';
import InfoPasswordTab from '../components/profile/InfoPasswordTab';
import AddressTab from '../components/profile/AddressTab';
import OrdersTab from '../components/profile/OrdersTab';

const TABS = ['info', 'address', 'orders'];

export default function Profile() {
  const { t } = useI18n();
  const [tab, setTab] = useState('info');

  const tabLabel = {
    info: t('tab_info_password'),
    address: t('tab_address'),
    orders: t('tab_orders'),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center gap-2 text-sm text-ink/50 mb-10">
        <Link to="/" className="hover:text-forest">{t('nav_home')}</Link>
        <IconChevron className="rtl:rotate-180" width="14" height="14" />
        <span className="text-ink">{t('my_profile')}</span>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
        <div className="bg-mint/50 rounded-2xl overflow-hidden">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center justify-between px-5 py-4 text-base border-b border-forest/10 last:border-b-0 text-left rtl:text-right transition-colors ${
                tab === key ? 'bg-white text-ink font-medium' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {tabLabel[key]}
              <IconChevron className="rtl:rotate-180 text-ink/40" width="16" height="16" />
            </button>
          ))}
        </div>

        <div>
          {tab === 'info' && <InfoPasswordTab />}
          {tab === 'address' && <AddressTab />}
          {tab === 'orders' && <OrdersTab />}
        </div>
      </div>
    </div>
  );
}
