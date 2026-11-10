import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Empty, ErrorBox, Spinner } from '../components/ui';
import { listBrands, listCategories, listProducts, type ProductQuery } from '../lib/api';
import { rupeesToMinor } from '../lib/format';
import { isConfigured } from '../lib/supabase';
import type { Category, Product } from '../lib/types';

const SORTS: { v: NonNullable<ProductQuery['sort']>; l: string }[] = [
  { v: 'new', l: 'Newest' }, { v: 'popular', l: 'Most popular' }, { v: 'price_asc', l: 'Price: low to high' }, { v: 'price_desc', l: 'Price: high to low' },
];

export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const category = sp.get('category') ?? '';
  const brand = sp.get('brand') ?? '';
  const deals = sp.get('deals') === '1';
  const rawSort = sp.get('sort');
  const sort = SORTS.some((s) => s.v === rawSort) ? (rawSort as NonNullable<ProductQuery['sort']>) : 'new';
  const minP = sp.get('min') ?? '';
  const maxP = sp.get('max') ?? '';
  const [minIn, setMinIn] = useState(minP);
  const [maxIn, setMaxIn] = useState(maxP);
  const [cats, setCats] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [items, setItems] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    listCategories().then(setCats).catch(() => undefined);
    listBrands().then(setBrands).catch(() => undefined);
  }, []);
  useEffect(() => { setMinIn(minP); setMaxIn(maxP); }, [minP, maxP]);

  useEffect(() => {
    if (!isConfigured) { setItems([]); return; }
    let live = true;
    setItems(null); setErr(null);
    const min = minP ? rupeesToMinor(minP) : null;
    const max = maxP ? rupeesToMinor(maxP) : null;
    listProducts({ q, category: category || undefined, brand: brand || undefined, deals, sort, minPrice: min ?? undefined, maxPrice: max ?? undefined })
      .then((r) => { if (live) setItems(r); })
      .catch((e: Error) => { if (live) setErr(e.message); });
    return () => { live = false; };
  }, [q, category, brand, deals, sort, minP, maxP]);

  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };
  const clear = () => setSp(new URLSearchParams(), { replace: true });
  const hasFilters = Boolean(category || brand || deals || minP || maxP);
  const applyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const n = new URLSearchParams(sp);
    for (const [k, v] of [['min', minIn], ['max', maxIn]] as const) { if (v.trim() && rupeesToMinor(v) != null) n.set(k, v.trim()); else n.delete(k); }
    setSp(n, { replace: true });
  };
  const catName = cats.find((c) => c.slug === category)?.name;
  const title = q ? `Results for “${q}”` : deals ? 'Deals' : catName ?? 'All Products';

  const filters = (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">Category</h2>
        <ul className="space-y-1 text-sm">
          <li><button className={`w-full rounded-lg px-3 py-2 text-left ${!category ? 'bg-accent/15 font-semibold text-accent' : 'hover:bg-accent/10'}`} onClick={() => set('category', '')}>All categories</button></li>
          {cats.map((c) => <li key={c.id}><button className={`w-full rounded-lg px-3 py-2 text-left ${category === c.slug ? 'bg-accent/15 font-semibold text-accent' : 'hover:bg-accent/10'}`} onClick={() => set('category', c.slug)}>{c.name}</button></li>)}
        </ul>
      </div>
      {brands.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">Brand</h2>
          <select className="input" aria-label="Brand" value={brand} onChange={(e) => set('brand', e.target.value)}>
            <option value="">All brands</option>{brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}
      <form onSubmit={applyPrice}>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">Price (₹)</h2>
        <div className="flex items-center gap-2">
          <input className="input px-3 py-2" inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={minIn} onChange={(e) => setMinIn(e.target.value)} />
          <span className="text-muted">–</span>
          <input className="input px-3 py-2" inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={maxIn} onChange={(e) => setMaxIn(e.target.value)} />
        </div>
        <button className="btn-primary mt-3 w-full py-2">Apply</button>
      </form>
      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={deals} onChange={(e) => set('deals', e.target.checked ? '1' : '')} /> Only deals (on sale)</label>
      {hasFilters && <button className="btn-ghost w-full py-2" onClick={clear}>Clear filters</button>}
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="force-dark relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-[#050b24] to-[#0b2a7a] px-6 py-8 text-ink sm:px-9">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400"><Link to="/" className="hover:text-white">Home</Link> / <span className="text-slate-200">Shop</span></nav>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">Smart Choice. Better Life.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block"><div className="card sticky top-24 p-4">{filters}</div></aside>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-ghost lg:hidden" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>Filters{hasFilters ? ' •' : ''}</button>
            <span className="text-sm text-muted">{items ? `${items.length} product${items.length === 1 ? '' : 's'}` : ''}</span>
            <select className="input ml-auto w-auto min-w-48" aria-label="Sort" value={sort} onChange={(e) => set('sort', e.target.value === 'new' ? '' : e.target.value)}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
          {showFilters && <div className="card p-4 lg:hidden">{filters}</div>}
          {err ? <ErrorBox message={err} /> : items === null ? <Spinner /> : items.length === 0 ? <Empty title="No products found">Try another search or clear the filters.</Empty> : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
