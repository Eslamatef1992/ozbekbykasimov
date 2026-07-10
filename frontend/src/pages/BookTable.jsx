import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { IconCalendar, IconClock, IconCheck } from '../components/icons';
import DatePickerPopover from '../components/DatePickerPopover';
import TimePickerPopover from '../components/TimePickerPopover';

function to24Hour(label) {
  // "6:00 PM" -> "18:00:00"
  const [time, meridiem] = label.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (meridiem === 'PM' && h !== 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function formatDateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function BookTable() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: '',
    email: user?.email || '',
    party_size: '',
    date: '',
    time: '',
    notes: '',
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time) { setError('Please select a date and time'); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post('/reservations', {
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        party_size: Number(form.party_size) || 1,
        reservation_date: form.date,
        reservation_time: to24Hour(form.time),
        notes: form.notes,
      });
      setConfirmation({ id: data.id, ...form });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit reservation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="text-sm text-ink/50 mb-10">{t('nav_home')} &gt; {t('book_table_title')}</div>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="relative h-80 md:h-full">
          <div className="absolute inset-0 rounded-2xl bg-mint overflow-hidden" />
          <div className="absolute -bottom-6 -right-4 rtl:-left-4 rtl:right-auto w-40 h-32 rounded-xl bg-tag border-4 border-white shadow-lg" />
          <div className="absolute top-6 left-6 rtl:right-6 rtl:left-auto bg-white rounded-lg shadow px-4 py-2.5 flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="w-6 h-6" />
            <span className="text-xs tracking-widest text-ink">OZBEK BY KASIMOV</span>
          </div>
        </div>

        <div>
          <h1 className="page-heading mb-8">{t('book_table_title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label={t('name')} required>
              <input required placeholder={t('enter_name')} value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="field" />
            </Field>
            <Field label={t('email')} required>
              <input required type="email" placeholder={t('enter_mail')} value={form.email} onChange={(e) => update('email', e.target.value)} className="field" />
            </Field>
            <Field label={t('phone_number')} required>
              <div className="flex">
                <span className="flex items-center gap-1.5 px-3 border border-r-0 rtl:border-r rtl:border-l-0 border-ink/15 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg text-base text-ink/70 bg-mint/40">🇰🇼 +965</span>
                <input required placeholder={t('enter_phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} className="field rounded-l-none rtl:rounded-l-lg rtl:rounded-r-none" />
              </div>
            </Field>
            <Field label={t('number_of_person')} required>
              <input required type="number" min="1" placeholder={t('enter_number_of_person')} value={form.party_size}
                onChange={(e) => update('party_size', e.target.value)} className="field" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t('select_date')} required>
                <div className="relative">
                  <button type="button" onClick={() => { setDatePickerOpen((o) => !o); setTimePickerOpen(false); }}
                    className="field flex items-center justify-between text-left">
                    <span className={form.date ? 'text-ink' : 'text-ink/35'}>{form.date ? formatDateLabel(form.date) : t('select_date')}</span>
                    <IconCalendar className="text-ink/40" />
                  </button>
                  {datePickerOpen && (
                    <DatePickerPopover value={form.date} onSelect={(d) => update('date', d)} onClose={() => setDatePickerOpen(false)} />
                  )}
                </div>
              </Field>
              <Field label={t('select_time')} required>
                <div className="relative">
                  <button type="button" onClick={() => { setTimePickerOpen((o) => !o); setDatePickerOpen(false); }}
                    className="field flex items-center justify-between text-left">
                    <span className={form.time ? 'text-ink' : 'text-ink/35'}>{form.time || t('select_time')}</span>
                    <IconClock className="text-ink/40" />
                  </button>
                  {timePickerOpen && (
                    <TimePickerPopover value={form.time} onSelect={(v) => update('time', v)} onClose={() => setTimePickerOpen(false)} />
                  )}
                </div>
              </Field>
            </div>

            {error && <p className="text-red-600 text-base">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full">{submitting ? '...' : t('book')}</button>
          </form>
        </div>
      </div>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setConfirmation(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-9 text-center">
            <div className="w-16 h-16 rounded-full bg-tag text-forest flex items-center justify-center mx-auto mb-5">
              <IconCheck />
            </div>
            <h2 className="font-display text-2xl mb-3">{t('booking_confirmed')}</h2>
            <p className="text-base text-ink/60 mb-7">{t('booking_confirmed_sub')}</p>
            <div className="section-label text-sm mb-4">{t('booking_details')}</div>
            <dl className="text-base text-left rtl:text-right space-y-2.5 mb-2">
              <Row label="Booking ID" value={`#${confirmation.id}`} />
              <Row label={t('name')} value={confirmation.full_name} />
              <Row label={t('email')} value={confirmation.email} />
              <Row label={t('phone_number')} value={`+965 ${confirmation.phone}`} />
              <Row label={t('select_date')} value={formatDateLabel(confirmation.date)} />
              <Row label={t('select_time')} value={confirmation.time} />
              <Row label={t('number_of_person')} value={confirmation.party_size} />
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-base text-ink mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-ink font-medium">{value}</dd>
    </div>
  );
}
