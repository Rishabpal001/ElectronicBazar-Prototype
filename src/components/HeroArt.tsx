/** Hand-drawn vector devices on a neon ring. No images needed, so it loads instantly. */
export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 430" className={className} role="img" aria-label="Phone, laptop, headphones, smartwatch and earbuds">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#6366f1" /></linearGradient>
        <linearGradient id="scr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c3aed" /><stop offset=".55" stopColor="#2563eb" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
        <linearGradient id="scr2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f97316" /><stop offset=".5" stopColor="#db2777" /><stop offset="1" stopColor="#6366f1" /></linearGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#2563eb" stopOpacity=".55" /><stop offset="1" stopColor="#2563eb" stopOpacity="0" /></radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <circle cx="270" cy="215" r="200" fill="url(#glow)" />
      <circle cx="270" cy="215" r="165" fill="none" stroke="url(#ring)" strokeWidth="5" opacity=".9" filter="url(#soft)" />
      <circle cx="270" cy="215" r="165" fill="none" stroke="url(#ring)" strokeWidth="3" />
      <circle cx="270" cy="215" r="195" fill="none" stroke="#38bdf8" strokeOpacity=".25" strokeDasharray="4 10" />

      {/* laptop */}
      <g transform="rotate(-6 340 250)">
        <rect x="255" y="165" width="200" height="125" rx="9" fill="#0b1226" stroke="#334155" strokeWidth="3" />
        <rect x="263" y="173" width="184" height="109" rx="4" fill="url(#scr2)" />
        <path d="M263 250c40-40 70-10 110-40s50 10 74-8v80H263z" fill="#0b1226" opacity=".35" />
        <path d="M235 296h240l-14 14H249z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      </g>
      {/* phone */}
      <g transform="rotate(8 330 190)">
        <rect x="292" y="62" width="104" height="205" rx="18" fill="#0b1226" stroke="#64748b" strokeWidth="3" />
        <rect x="299" y="69" width="90" height="191" rx="12" fill="url(#scr1)" />
        <rect x="329" y="74" width="30" height="8" rx="4" fill="#0b1226" />
        <circle cx="344" cy="170" r="42" fill="#fff" opacity=".12" />
        <path d="M299 200c30-30 40 10 90-20v80H299z" fill="#fff" opacity=".1" />
      </g>
      {/* headphones */}
      <g>
        <path d="M95 235v-35c0-46 30-80 75-80s75 34 75 80v35" fill="none" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
        <path d="M95 235v-35c0-46 30-80 75-80s75 34 75 80v35" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
        <rect x="68" y="205" width="48" height="92" rx="22" fill="#111827" stroke="#38bdf8" strokeWidth="2.5" />
        <rect x="224" y="205" width="48" height="92" rx="22" fill="#111827" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="92" cy="251" r="12" fill="#0f172a" stroke="#38bdf8" strokeOpacity=".6" />
        <circle cx="248" cy="251" r="12" fill="#0f172a" stroke="#38bdf8" strokeOpacity=".6" />
      </g>
      {/* smartwatch */}
      <g transform="rotate(-8 195 330)">
        <rect x="176" y="268" width="38" height="28" fill="#0f172a" /><rect x="176" y="355" width="38" height="30" fill="#0f172a" />
        <rect x="160" y="290" width="70" height="72" rx="20" fill="#0b1226" stroke="#64748b" strokeWidth="3" />
        <rect x="167" y="297" width="56" height="58" rx="14" fill="#020617" />
        <text x="195" y="334" textAnchor="middle" fontSize="20" fontWeight="700" fill="#38bdf8" fontFamily="Poppins, sans-serif">10:10</text>
        <path d="M172 346h46" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* earbuds case */}
      <g>
        <ellipse cx="365" cy="358" rx="52" ry="10" fill="#020617" opacity=".5" />
        <rect x="320" y="318" width="90" height="40" rx="20" fill="#f8fafc" />
        <path d="M322 336h86" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="365" cy="345" r="3" fill="#94a3b8" />
        <ellipse cx="345" cy="312" rx="10" ry="14" fill="#fff" stroke="#e2e8f0" />
        <ellipse cx="385" cy="312" rx="10" ry="14" fill="#fff" stroke="#e2e8f0" />
      </g>
      {/* speaker */}
      <g>
        <rect x="425" y="285" width="62" height="78" rx="16" fill="#0b1226" stroke="#475569" strokeWidth="2.5" />
        <circle cx="456" cy="324" r="20" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="456" cy="324" r="9" fill="#38bdf8" opacity=".5" />
      </g>
    </svg>
  );
}
