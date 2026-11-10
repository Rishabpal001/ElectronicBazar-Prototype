export function formatPrice(minor: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: minor % 100 === 0 ? 0 : 2 }).format(minor / 100);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

/** Deterministic gradient so every product without a photo still looks designed. */
export function gradientFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const a = h % 360;
  const b = (a + 40 + (h % 80)) % 360;
  return `linear-gradient(150deg, hsl(${215 + (a % 40)} 70% 38%), hsl(${230 + (b % 50)} 75% 20%))`;
}

export function deliveryText(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? 0;
  if (hi === 0) return 'Instant delivery';
  return lo === hi ? `Delivery in about ${lo} days` : `Delivery in ${lo}-${hi} days`;
}

/** "149" or "149.50" typed by an admin -> 14950 paise. Returns null when it is not a valid amount. */
export function rupeesToMinor(input: string): number | null {
  const t = input.trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(parseFloat(t) * 100);
}
export function minorToRupees(minor: number | null | undefined): string {
  if (minor == null) return '';
  return minor % 100 === 0 ? String(minor / 100) : (minor / 100).toFixed(2);
}
export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

/** Percent off, rounded down, or 0 when the product is not on sale. */
export function discountPercent(price: number, sale: number | null): number {
  if (sale == null || price <= 0 || sale >= price) return 0;
  return Math.floor(((price - sale) / price) * 100);
}

/** Admin text box "Label: value" per line  ->  highlights. Lines without a colon are ignored. Max 8. */
export function parseHighlights(text: string): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  for (const line of text.split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    const label = line.slice(0, i).trim().slice(0, 30);
    const value = line.slice(i + 1).trim().slice(0, 60);
    if (label && value) out.push({ label, value });
    if (out.length === 8) break;
  }
  return out;
}
export function highlightsToText(h: { label: string; value: string }[] | null | undefined): string {
  return (h ?? []).map((x) => `${x.label}: ${x.value}`).join('\n');
}
