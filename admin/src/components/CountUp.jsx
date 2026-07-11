import { useEffect, useRef, useState } from 'react';

// Animates a number counting up to `value` whenever it changes (e.g. after
// a stats refresh or date-filter change). Purely a small UI polish touch -
// falls back to just rendering `value` instantly if it isn't a number.
export default function CountUp({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const from = fromRef.current;
    const start = performance.now();
    let raf;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(from + (target - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const rounded = Number.isInteger(Number(value)) ? Math.round(display) : display.toFixed(0);
  return <>{rounded}</>;
}
