// Small inline icon set (no extra dependency) matching the line-icon style used in the Figma file.
export const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.5-3.8 5-5.5 7.5-5.5s6 1.7 7.5 5.5" />
  </svg>
);

export const IconBag = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20" {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconEye = ({ off, ...props }) => off ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c5 0 9 4 10 7-.4 1.2-1.3 2.6-2.6 3.8M6.7 6.7C4.6 8 3.2 10 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8" />
    <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconCalendar = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28" {...props}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const IconChevron = ({ dir = 'right', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"
    style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24" {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...props}>
    <path d="M5 4h3.2l1.4 4.5-2 1.6a12 12 0 0 0 6.3 6.3l1.6-2 4.5 1.4V19a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 4Z" />
  </svg>
);

export const IconBoxEmpty = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" {...props}>
    <path d="M3.5 8.2 12 4l8.5 4.2v7.6L12 20 3.5 15.8V8.2Z" />
    <path d="M3.5 8.2 12 12m0 0 8.5-3.8M12 12v8" />
    <circle cx="18.5" cy="16.5" r="4.2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" />
    <path d="m16.9 15 3.2 3M20.1 15l-3.2 3" strokeWidth="1.3" />
  </svg>
);
