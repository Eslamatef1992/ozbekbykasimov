import { useState } from 'react';
import { IconChevron } from './icons';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DatePickerPopover({ value, onSelect, onClose }) {
  const initial = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="absolute z-20 mt-2 bg-white border border-border rounded-xl shadow-lg p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="text-ink/50 hover:text-forest">
          <IconChevron dir="left" />
        </button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="text-ink/50 hover:text-forest">
          <IconChevron dir="right" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-ink/40 mb-1">
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const cellDate = new Date(year, month, d);
          const iso = toISODate(cellDate);
          const isPast = cellDate < today;
          const isSelected = value === iso;
          return (
            <button
              type="button"
              key={i}
              disabled={isPast}
              onClick={() => { onSelect(iso); onClose(); }}
              className={`w-9 h-9 rounded-full text-xs flex items-center justify-center
                ${isSelected ? 'bg-forest text-white' : isPast ? 'text-ink/20' : 'text-ink/70 hover:bg-tag'}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
