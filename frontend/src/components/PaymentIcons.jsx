// Payment-method badges. KNET, Apple Pay, Visa, Mastercard and Cash use the
// real uploaded brand assets; Samsung Pay has no provided asset yet so it
// keeps a simple styled placeholder chip.
const base = 'w-9 h-7 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0 leading-none';

export const KnetBadge = () => (
  <img src="/icons/knet.svg" alt="KNET" className="w-9 h-9 rounded shrink-0" />
);

export const MastercardBadge = () => (
  <img src="/icons/mastercard.svg" alt="Mastercard" className="w-9 h-9 rounded shrink-0" />
);

export const VisaBadge = () => (
  <img src="/icons/visa.svg" alt="Visa" className="w-9 h-9 rounded shrink-0" />
);

export const ApplePayBadge = () => (
  <img src="/icons/apple-pay.svg" alt="Apple Pay" className="w-9 h-9 rounded shrink-0" />
);

export const SamsungPayBadge = () => (
  <span className={`${base} bg-blue-600`}>Pay</span>
);

export const CashBadge = () => (
  <img src="/icons/cash.svg" alt="Cash" className="w-9 h-9 rounded shrink-0 p-1 bg-forest/5" />
);
