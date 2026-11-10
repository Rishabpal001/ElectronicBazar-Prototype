import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { listCategories } from '../lib/api';
import { CONTACT_EMAIL, isConfigured, SITE_NAME } from '../lib/supabase';
import type { Category } from '../lib/types';
import { SetupNotice } from './ui';
import { ChevronDown, Close, Heart, LogoMark, Menu, MoonSun, Package, Search, ShoppingBag, User } from './icons';

function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
}

function Brand() {
  const [first, ...rest] = SITE_NAME.split(' ');
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
      <LogoMark className="h-10 w-10" />
      <span className="font-display text-lg font-extrabold leading-[1.05] tracking-tight">
        <span className="block text-ink">{first}</span>
        <span className="block text-sun">{rest.join(' ')}</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const wish = useWishlist();
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState('');
  const [cats, setCats] = useState<Category[]>([]);
  const [menu, setMenu] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => { if (isConfigured) listCategories().then(setCats).catch(() => undefined); }, []);
  useEffect(() => { setMenu(false); setCatOpen(false); window.scrollTo({ top: 0 }); }, [loc.pathname, loc.search]);

  const link = ({ isActive }: { isActive: boolean }) => `rounded-full px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-accent text-white' : 'text-ink/80 hover:text-accent'}`;
  const iconBtn = 'relative flex h-10 w-10 items-center justify-center rounded-full text-ink/90 transition hover:bg-accent/15 hover:text-accent';
  const badge = 'absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white';
  const search = (e: React.FormEvent) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q.trim())}`); };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="force-dark sticky top-0 z-30 border-b border-line bg-navy/90 text-ink backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-5">
          <button className={`${iconBtn} lg:hidden`} onClick={() => setMenu((v) => !v)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>
            {menu ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Brand />

          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Main">
            <NavLink to="/" end className={link}>Home</NavLink>
            <NavLink to="/shop" end className={link}>Shop</NavLink>
            <div className="relative" onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-ink/80 transition hover:text-accent" aria-expanded={catOpen} onClick={() => setCatOpen((v) => !v)} onMouseEnter={() => setCatOpen(true)}>
                Categories <ChevronDown className="h-4 w-4" />
              </button>
              {catOpen && cats.length > 0 && (
                <div className="absolute left-0 top-full z-40 w-56 pt-2">
                  <div className="card max-h-80 overflow-auto p-2 shadow-card">
                    {cats.map((c) => <Link key={c.id} to={`/shop?category=${c.slug}`} className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent/15 hover:text-accent">{c.name}</Link>)}
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/shop?deals=1" className={() => 'rounded-full px-3.5 py-2 text-sm font-semibold text-ink/80 transition hover:text-accent'}>Deals</NavLink>
            <NavLink to="/about" className={link}>About</NavLink>
            <NavLink to="/contact" className={link}>Contact</NavLink>
            {isAdmin && <NavLink to="/admin" className={link}>Admin</NavLink>}
          </nav>

          <form className="ml-auto hidden max-w-xs flex-1 md:flex" onSubmit={search} role="search">
            <div className="relative w-full">
              <input className="input rounded-full py-2.5 pl-4 pr-10" placeholder="Search for products…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent" aria-label="Search"><Search className="h-4 w-4" /></button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button className={iconBtn} onClick={toggleTheme} aria-label="Toggle dark mode"><MoonSun className="h-5 w-5" /></button>
            <Link to={user ? '/account' : '/login'} className={iconBtn} aria-label={user ? 'Account' : 'Sign in'}><User className="h-5 w-5" /></Link>
            <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wish.ids.length} items`}>
              <Heart className="h-5 w-5" />{wish.ids.length > 0 && <span className={badge}>{wish.ids.length}</span>}
            </Link>
            <Link to="/cart" className={iconBtn} aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />{count > 0 && <span className={badge}>{count}</span>}
            </Link>
          </div>
        </div>

        {menu && (
          <div className="border-t border-line lg:hidden">
            <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
              <form onSubmit={search} role="search" className="relative">
                <input className="input rounded-full py-2.5 pl-4 pr-10" placeholder="Search for products…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Search"><Search className="h-4 w-4" /></button>
              </form>
              <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                {[['/', 'Home'], ['/shop', 'Shop'], ['/shop?deals=1', 'Deals'], ['/about', 'About'], ['/contact', 'Contact'], ['/wishlist', 'Wishlist']].map(([to, label]) => <Link key={to} to={to} className="chip justify-center">{label}</Link>)}
                {user && <Link to="/orders" className="chip justify-center"><Package className="h-4 w-4" /> Orders</Link>}
                {user && <Link to="/account" className="chip justify-center"><User className="h-4 w-4" /> {profile?.full_name?.split(' ')[0] || 'Account'}</Link>}
                {isAdmin && <Link to="/admin" className="chip justify-center">Admin</Link>}
              </div>
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-2">{cats.map((c) => <Link key={c.id} to={`/shop?category=${c.slug}`} className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent">{c.name}</Link>)}</div>
              )}
              {user ? <button className="btn-ghost w-full" onClick={() => signOut().then(() => nav('/'))}>Sign out</button> : <Link to="/login" className="btn-primary w-full">Sign in</Link>}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:py-10">
        <SetupNotice />
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-line bg-navy px-4 py-10 text-sm text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-extrabold text-white"><LogoMark className="h-9 w-9" />{SITE_NAME}</div>
            <p className="mt-3 text-slate-400">Smart Choice. Better Life. Genuine electronics at honest prices.</p>
          </div>
          <div><h3 className="font-bold text-white">Shop</h3><ul className="mt-3 space-y-2"><li><Link className="hover:text-sun" to="/shop">All products</Link></li><li><Link className="hover:text-sun" to="/shop?deals=1">Deals</Link></li><li><Link className="hover:text-sun" to="/wishlist">Wishlist</Link></li></ul></div>
          <div><h3 className="font-bold text-white">Account</h3><ul className="mt-3 space-y-2"><li><Link className="hover:text-sun" to="/orders">My orders</Link></li><li><Link className="hover:text-sun" to="/cart">Cart</Link></li><li><Link className="hover:text-sun" to="/account">Profile</Link></li></ul></div>
          <div><h3 className="font-bold text-white">Help</h3><ul className="mt-3 space-y-2"><li><Link className="hover:text-sun" to="/about">About us</Link></li><li><Link className="hover:text-sun" to="/contact">Contact</Link></li>{CONTACT_EMAIL && <li><a className="hover:text-sun" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>}</ul></div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center text-slate-500">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
}
