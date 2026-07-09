import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs text-ink/50 mb-8">Home &gt; Book A Table</div>

      <div className="grid md:grid-cols-2 gap-14">
        <div className="relative h-80 md:h-full">
          <div className="absolute inset-0 rounded-2xl bg-mint overflow-hidden" />
          <div className="absolute -bottom-6 -right-4 w-40 h-32 rounded-xl bg-tag border-4 border-white shadow-lg" />
          <div className="absolute top-6 left-6 bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border border-forest/50 flex items-center justify-center text-[8px]">OZ</span>
            <span className="text-[10px] tracking-widest text-ink">OZBEK BY KASIMOV</span>
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl mb-6">Book A Table</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Name" required>
              <input required placeholder="Enter Name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="field" />
            </Field>
            <Field label="Email" required>
              <input required type="email" placeholder="Enter Mail" value={form.email} onChange={(e) => update('email', e.target.value)} className="field" />
            </Field>
            <Field label="Phone Number" required>
              <div className="flex">
                <span className="flex items-center gap-1 px-3 border border-r-0 border-ink/15 rounded-l-lg text-sm text-ink/70 bg-mint/40">🇰🇼 +965</span>
                <input required placeholder="Enter Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="field rounded-l-none" />
              </div>
            </Field>
            <Field label="Number Of Person" required>
              <input required type="number" min="1" placeholder="Enter Number Of Person" value={form.party_size}
                onChange={(e) => update('party_size', e.target.value)} className="field" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Select Date" required>
                <div className="relative">
                  <button type="button" onClick={() => { setDatePickerOpen((o) => !o); setTimePickerOpen(false); }}
                    className="field flex items-center justify-between text-left">
                    <span className={form.date ? 'text-ink' : 'text-ink/35'}>{form.date ? formatDateLabel(form.date) : 'Select Date'}</span>
                    <IconCalendar className="text-ink/40" />
                  </button>
                  {datePickerOpen && (
                    <DatePickerPopover value={form.date} onSelect={(d) => update('date', d)} onClose={() => setDatePickerOpen(false)} />
                  )}
                </div>
              </Field>
              <Field label="Select Time" required>
                <div className="relative">
                  <button type="button" onClick={() => { setTimePickerOpen((o) => !o); setDatePickerOpen(false); }}
                    className="field flex items-center justify-between text-left">
                    <span className={form.time ? 'text-ink' : 'text-ink/35'}>{form.time || 'Select Time'}</span>
                    <IconClock className="text-ink/40" />
                  </button>
                  {timePickerOpen && (
                    <TimePickerPopover value={form.time} onSelect={(t) => update('time', t)} onClose={() => setTimePickerOpen(false)} />
                  )}
                </div>
              </Field>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Booking...' : 'Book'}</button>
          </form>
        </div>
      </div>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setConfirmation(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-tag text-forest flex items-center justify-center mx-auto mb-4">
              <IconCheck />
            </div>
            <h2 className="font-display text-xl mb-2">Your Booking Confirmed</h2>
            <p className="text-sm text-ink/60 mb-6">Your Table has been Successfully Reserved. See You Soon!</p>
            <div className="section-label text-xs mb-3">Booking Details</div>
            <dl className="text-sm text-left space-y-2 mb-2">
              <Row label="Booking ID" value={`#${confirmation.id}`} />
              <Row label="Guest Name" value={confirmation.full_name} />
              <Row label="Email" value={confirmation.email} />
              <Row label="Phone Number" value={`+965 ${confirmation.phone}`} />
              <Row label="Date" value={formatDateLabel(confirmation.date)} />
              <Row label="Time" value={confirmation.time} />
              <Row label="Number of People" value={confirmation.party_size} />
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
      <label className="block text-sm text-ink mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
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
