// Small stylized payment-method badges (not official brand marks, just
// recognizable colored chips so the checkout list is easy to scan).
const base = 'w-8 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0 leading-none';

export const KnetBadge = () => (
  <span className={`${base} bg-gradient-to-br from-sky-500 to-yellow-400`}>KNET</span>
);

export const MastercardBadge = () => (
  <span className="w-8 h-6 rounded bg-ink/5 flex items-center justify-center shrink-0">
    <span className="relative w-4 h-4">
      <span className="absolute left-0 top-0 w-3 h-3 rounded-full bg-red-500/90" />
      <span className="absolute right-0 top-0 w-3 h-3 rounded-full bg-yellow-500/80 mix-blend-multiply" />
    </span>
  </span>
);

export const VisaBadge = () => (
  <span className={`${base} bg-blue-900 italic`}>VISA</span>
);

export const ApplePayBadge = () => (
  <span className={`${base} bg-ink`}>Pay</span>
);

export const SamsungPayBadge = () => (
  <span className={`${base} bg-blue-600`}>Pay</span>
);

export const CashBadge = () => (
  <span className={`${base} bg-forest`}>$</span>
);
