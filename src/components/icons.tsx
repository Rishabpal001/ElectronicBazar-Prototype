import type { ReactNode } from 'react';

type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

// ---------- general ----------
export const Search = ({ className }: IconProps) => (<Icon className={className}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></Icon>);
export const ShoppingBag = ({ className }: IconProps) => (<Icon className={className}><path d="M3 4h2.5l2.2 10.5h9.6L20 7H6.4" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></Icon>);
export const Heart = ({ className }: IconProps) => (<Icon className={className}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></Icon>);
export const MoonSun = ({ className }: IconProps) => (
  <Icon className={className}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /><circle cx="17" cy="7" r="1.6" /><path d="M17 3.5v.6M17 9.9v.6M13.5 7h.6M19.9 7h.6" /></Icon>
);
export const ArrowRight = ({ className }: IconProps) => (<Icon className={className}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Icon>);
export const ArrowUpRight = ({ className }: IconProps) => (<Icon className={className}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></Icon>);
export const ChevronDown = ({ className }: IconProps) => (<Icon className={className}><path d="M6 9l6 6 6-6" /></Icon>);
export const ChevronLeft = ({ className }: IconProps) => (<Icon className={className}><path d="M15 6l-6 6 6 6" /></Icon>);
export const ChevronRight = ({ className }: IconProps) => (<Icon className={className}><path d="M9 6l6 6-6 6" /></Icon>);
export const Menu = ({ className }: IconProps) => (<Icon className={className}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>);
export const Close = ({ className }: IconProps) => (<Icon className={className}><path d="M6 6l12 12M18 6L6 18" /></Icon>);
export const User = ({ className }: IconProps) => (<Icon className={className}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" /></Icon>);
export const Package = ({ className }: IconProps) => (<Icon className={className}><path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2L12 3z" /><path d="M4 7.2l8 4.3 8-4.3" /><path d="M12 11.5V21" /></Icon>);
export const Star = ({ className }: IconProps) => (<Icon className={className}><path d="M12 4l2.4 5 5.4.7-4 3.8 1 5.4L12 16.2 7.2 18.9l1-5.4-4-3.8 5.4-.7L12 4z" /></Icon>);
export const Truck = ({ className }: IconProps) => (<Icon className={className}><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></Icon>);
export const Check = ({ className }: IconProps) => (<Icon className={className}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>);
export const Shield = ({ className }: IconProps) => (<Icon className={className}><path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3z" /><path d="M9 12l2.2 2.2L15.5 10" /></Icon>);
export const Headset = ({ className }: IconProps) => (<Icon className={className}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.5-2 2-5 2" /></Icon>);
export const Percent = ({ className }: IconProps) => (<Icon className={className}><path d="M19 5L5 19" /><circle cx="7.5" cy="7.5" r="2.2" /><circle cx="16.5" cy="16.5" r="2.2" /></Icon>);
export const Gift = ({ className }: IconProps) => (<Icon className={className}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8v12" /><path d="M12 8c-2-3-6-3-5 0 .5 1.5 3 1 5 0z" /><path d="M12 8c2-3 6-3 5 0-.5 1.5-3 1-5 0z" /></Icon>);
export const Return = ({ className }: IconProps) => (<Icon className={className}><path d="M4 12a8 8 0 1 0 2.5-5.8" /><path d="M4 4v4.5h4.5" /></Icon>);
export const Bolt = ({ className }: IconProps) => (<Icon className={className}><path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" /></Icon>);
export const Mail = ({ className }: IconProps) => (<Icon className={className}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></Icon>);

// ---------- category icons ----------
export const Smartphone = ({ className }: IconProps) => (<Icon className={className}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></Icon>);
export const Laptop = ({ className }: IconProps) => (<Icon className={className}><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 19h19l-1.5-4H4l-1.5 4z" /></Icon>);
export const Headphones = ({ className }: IconProps) => (<Icon className={className}><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4.5" height="7" rx="2" /><rect x="16.5" y="14" width="4.5" height="7" rx="2" /></Icon>);
export const Watch = ({ className }: IconProps) => (<Icon className={className}><rect x="7" y="6.5" width="10" height="11" rx="3" /><path d="M9 6.5l.7-3.5h4.6l.7 3.5M9 17.5l.7 3.5h4.6l.7-3.5" /><path d="M12 10v2.2l1.4.9" /></Icon>);
export const Earbuds = ({ className }: IconProps) => (<Icon className={className}><path d="M8 3.5a3.5 3.5 0 0 0-3.5 3.5c0 1.8 1.2 3 2.5 3.3V17a1.5 1.5 0 0 0 3 0V7A3.5 3.5 0 0 0 8 3.5z" /><path d="M16 9.5a3.5 3.5 0 0 1 3.5 3.5c0 1.8-1.2 3-2.5 3.3V21" /></Icon>);
export const Blender = ({ className }: IconProps) => (<Icon className={className}><path d="M6 3h12l-1.5 11h-9L6 3z" /><path d="M8 14l-.5 3h9l-.5-3" /><rect x="7" y="17" width="10" height="4" rx="1.5" /><path d="M9 7h6" /></Icon>);
export const Gamepad = ({ className }: IconProps) => (<Icon className={className}><path d="M7 7h10a4.5 4.5 0 0 1 4.4 5.4l-.8 4A2.5 2.5 0 0 1 16 17.5l-1.5-2h-5L8 17.5a2.5 2.5 0 0 1-4.6-1.1l-.8-4A4.5 4.5 0 0 1 7 7z" /><path d="M8 10v3M6.5 11.5h3" /><circle cx="15" cy="10.5" r=".6" /><circle cx="17" cy="12.5" r=".6" /></Icon>);
export const Camera = ({ className }: IconProps) => (<Icon className={className}><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.6" /></Icon>);
export const Tv = ({ className }: IconProps) => (<Icon className={className}><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>);
export const Dots = ({ className }: IconProps) => (<Icon className={className}><circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" /></Icon>);
export const Cpu = ({ className }: IconProps) => (<Icon className={className}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></Icon>);
export const Battery = ({ className }: IconProps) => (<Icon className={className}><rect x="3" y="8" width="16" height="8" rx="2" /><path d="M21 11v2" /><path d="M6.5 11v2M9.5 11v2M12.5 11v2" /></Icon>);
export const Speaker = ({ className }: IconProps) => (<Icon className={className}><rect x="6" y="3" width="12" height="18" rx="3" /><circle cx="12" cy="14.5" r="3" /><circle cx="12" cy="7" r="1" /></Icon>);

/** Picks a category icon from the category slug or name. Falls back to a generic chip. */
export function categoryIcon(key: string): (p: IconProps) => JSX.Element {
  const k = key.toLowerCase();
  if (/phone|mobile/.test(k)) return Smartphone;
  if (/laptop|computer|pc/.test(k)) return Laptop;
  if (/audio|headphone|speaker|sound/.test(k)) return Headphones;
  if (/watch|wearable/.test(k)) return Watch;
  if (/accessor|earbud|charger|cable/.test(k)) return Earbuds;
  if (/appliance|kitchen|home/.test(k)) return Blender;
  if (/gam|console/.test(k)) return Gamepad;
  if (/camera|photo/.test(k)) return Camera;
  if (/tv|display|monitor/.test(k)) return Tv;
  return Dots;
}

/** Shop logo: a blue cart with yellow wheels. */
export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M4 8h6l4 20h22l4-14H13" fill="none" stroke="#2f7bff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="17" y="15" width="17" height="10" rx="2" fill="#2f7bff" opacity=".25" />
      <path d="M21 21h9" stroke="#2f7bff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="38" r="3.6" fill="#facc15" />
      <circle cx="33" cy="38" r="3.6" fill="#facc15" />
    </svg>
  );
}
