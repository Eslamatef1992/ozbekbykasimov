const SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
];

export default function TimePickerPopover({ value, onSelect, onClose }) {
  return (
    <div className="absolute z-20 mt-2 bg-white border border-border rounded-xl shadow-lg p-4 w-64">
      <div className="text-xs text-ink/50 mb-3">Available Time</div>
      <div className="grid grid-cols-2 gap-2">
        {SLOTS.map((slot) => (
          <button
            type="button"
            key={slot}
            onClick={() => { onSelect(slot); onClose(); }}
            className={`text-xs px-3 py-2 rounded-lg border ${value === slot ? 'bg-forest text-white border-forest' : 'border-border text-ink/70 hover:border-forest'}`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
