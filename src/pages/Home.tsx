import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroArt from '../components/HeroArt';
import { ArrowRight, Bolt, categoryIcon, ChevronLeft, ChevronRight, Gift, Headset, Return, Shield, Truck } from '../components/icons';
import ProductCard from '../components/ProductCard';
import { ErrorBox, Spinner } from '../components/ui';
import { listCategories, listProducts } from '../lib/api';
import { discountPercent } from '../lib/format';
import { isConfigured, SITE_NAME } from '../lib/supabase';
import type { Category, Product } from '../lib/types';

const SLIDES = [
  { kicker: 'Smart Choice. Better Life.', sub: 'Your One-Stop Shop for Latest Electronics!', cta: 'Shop Now', to: '/shop' },
  { kicker: 'Upgrade your everyday.', sub: 'Phones, laptops and audio from brands you trust.', cta: 'Browse Products', to: '/shop' },
  { kicker: 'Big savings, every week.', sub: 'Grab the best prices on top electronics.', cta: 'See Deals', to: '/shop?deals=1' },
];

/** Optional: set the repository Variable VITE_SALE_ENDS (e.g. 2026-12-31T23:59:00+05:30) to show a real countdown. */
const SALE_ENDS = (import.meta.env.VITE_SALE_ENDS as string | undefined)?.trim();

function useCountdown(endIso: string | undefined) {
  const end = endIso ? Date.parse(endIso) : NaN;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (Number.isNaN(end)) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [end]);
  if (Number.isNaN(end) || end <= now) return null;
  const s = Math.floor((end - now) / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [deals, setDeals] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const left = useCountdown(SALE_ENDS);

  useEffect(() => {
    if (!isConfigured) { setFeatured([]); return; }
    Promise.all([listProducts({ featured: true, limit: 8 }), listCategories(), listProducts({ deals: true, limit: 10 })])
      .then(([p, c, d]) => { setFeatured(p); setCats(c); setDeals(d); })
      .catch((e: Error) => setErr(e.message));
  }, []);

  useEffect(() => {
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const s = SLIDES[slide];
  const [w1, ...w2] = SITE_NAME.split(' ');
  const best = deals.reduce((m, p) => Math.max(m, discountPercent(p.price_minor, p.sale_price_minor)), 0);
  const dealRow = deals.length ? deals : featured ?? [];

  return (
    <div className="space-y-14">
      {/* ---------------- hero ---------------- */}
      <section className="force-dark relative isolate overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-[#050b24] via-[#081a4d] to-[#0b2a7a] px-6 py-10 text-ink sm:px-12 sm:py-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured offers">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p key={`k${slide}`} className="font-display text-xl font-semibold text-cyan-300 sm:text-2xl">{s.kicker}</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">{w1}</span>
              <span className="block text-sun">{w2.join(' ')}</span>
            </h1>
            <p key={`s${slide}`} className="mt-5 max-w-md text-xl font-semibold leading-snug text-white sm:text-2xl">{s.sub}</p>
            <Link to={s.to} className="btn-sun mt-7 px-8 py-3.5 text-base">{s.cta} <ArrowRight className="h-5 w-5" /></Link>
            <ul className="mt-9 grid max-w-md grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2.5"><Truck className="h-8 w-8 text-sun" /><span><b className="block text-white">Fast Delivery</b><span className="text-slate-400">Across India</span></span></li>
              <li className="flex items-center gap-2.5"><Shield className="h-8 w-8 text-emerald-400" /><span><b className="block text-white">Secure Payment</b><span className="text-slate-400">UPI, cards, COD</span></span></li>
              <li className="flex items-center gap-2.5"><Headset className="h-8 w-8 text-sun" /><span><b className="block text-white">Support</b><span className="text-slate-400">Always here</span></span></li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-lg"><HeroArt className="floaty h-auto w-full" /></div>
        </div>
        <div className="relative mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
          {SLIDES.map((_, i) => <button key={i} role="tab" aria-selected={i === slide} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} className={`h-2.5 rounded-full transition-all ${i === slide ? 'w-7 bg-sun' : 'w-2.5 bg-white/30 hover:bg-white/60'}`} />)}
        </div>
      </section>

      {err && <ErrorBox message={err} />}

      {/* ---------------- categories ---------------- */}
      {cats.length > 0 && (
        <section aria-label="Categories" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-sm font-bold text-accent">— Shop by Category</span>
              <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Explore Our <span className="text-sun">Categories</span></h2>
              <p className="mt-1 text-sm text-muted">Find the best electronics in every category</p>
            </div>
            <span className="hidden text-sm font-semibold text-accent sm:block">Smart Tech. Smart Life.</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {cats.map((c) => {
              const Ico = categoryIcon(`${c.slug} ${c.name}`);
              return (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="card group flex flex-col items-center gap-3 p-5 text-center hover:-translate-y-1 hover:border-accent hover:shadow-glow">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-violet-500/20 text-accent transition group-hover:scale-110"><Ico className="h-9 w-9" /></span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold">{c.name}<ArrowRight className="h-3.5 w-3.5 opacity-60 transition group-hover:translate-x-0.5" /></span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- promo ---------------- */}
      {(best > 0 || left) && (
        <section className="force-dark relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-[#1d2bd6] via-[#3b3fe0] to-[#7c3aed] px-6 py-8 text-ink sm:px-10">
          <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15"><Gift className="h-9 w-9 text-sun" /></span>
              <div>
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{best > 0 ? `Big Savings — up to ${best}% off` : 'Limited Time Offer!'}</h2>
                <p className="text-sm text-blue-100">Top brands, honest prices. Grab them before the stock runs out.</p>
              </div>
            </div>
            {left && (
              <div className="flex gap-2" role="timer" aria-label="Sale ends in">
                {([['Days', left.d], ['Hours', left.h], ['Min', left.m], ['Sec', left.s]] as const).map(([l, v]) => (
                  <div key={l} className="w-16 rounded-xl bg-white/15 py-2"><div className="text-2xl font-extrabold text-white">{String(v).padStart(2, '0')}</div><div className="text-[11px] text-blue-100">{l}</div></div>
                ))}
              </div>
            )}
            <Link to="/shop?deals=1" className="btn-sun px-7">Grab Deal <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      )}

      {/* ---------------- top deals ---------------- */}
      <section className="space-y-6" aria-label="Top deals">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-accent">— Best Deals</span>
            <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Top Deals for <span className="text-sun">You</span></h2>
          </div>
          <Link to="/shop?deals=1" className="btn-ghost">View All <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {featured === null ? <Spinner /> : dealRow.length === 0 ? (
          <p className="card border-dashed p-10 text-center text-muted">No products yet. Add some from the admin panel.</p>
        ) : (
          <DealRow items={dealRow} />
        )}
      </section>

      {/* ---------------- featured ---------------- */}
      {featured && featured.length > 0 && (
        <section className="space-y-6" aria-label="Featured products">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-accent">— Handpicked</span>
              <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Featured <span className="text-sun">Products</span></h2>
            </div>
            <Link to="/shop" className="btn-ghost">Shop all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      {/* ---------------- why us ---------------- */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Why shop with us">
        {[[Truck, 'Fast delivery', 'Shipped quickly across India.'], [Shield, 'Secure payment', 'Pay online or cash on delivery.'], [Return, 'Easy support', 'Questions about an order? Write to us.'], [Bolt, 'Latest tech', 'New arrivals added all the time.']].map(([I, t, d]) => {
          const Ico = I as typeof Truck;
          return <div key={t as string} className="card flex items-start gap-3 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"><Ico className="h-6 w-6" /></span><div><h3 className="font-bold">{t as string}</h3><p className="text-sm text-muted">{d as string}</p></div></div>;
        })}
      </section>
    </div>
  );
}

function DealRow({ items }: { items: Product[] }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const go = (dir: 1 | -1) => el?.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  return (
    <div className="relative">
      <div ref={setEl} className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-4">
        {items.map((p) => <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]"><ProductCard product={p} /></div>)}
      </div>
      <button className="absolute -left-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg sm:flex" onClick={() => go(-1)} aria-label="Scroll left"><ChevronLeft className="h-5 w-5" /></button>
      <button className="absolute -right-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg sm:flex" onClick={() => go(1)} aria-label="Scroll right"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
}
