import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { parseWishlist } from '../lib/wishlist';

// Wishlist is kept in this browser only (no database table needed).
const KEY = 'eb_wishlist_v1';

type Ctx = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void };
const WishlistCtx = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => { try { return parseWishlist(localStorage.getItem(KEY)); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* storage blocked */ } }, [ids]);
  const toggle = useCallback((id: string) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [id, ...s].slice(0, 100))), []);
  const value = useMemo<Ctx>(() => ({ ids, has: (id) => ids.includes(id), toggle }), [ids, toggle]);
  return <WishlistCtx.Provider value={value}>{children}</WishlistCtx.Provider>;
}

export function useWishlist(): Ctx {
  const c = useContext(WishlistCtx);
  if (!c) throw new Error('useWishlist must be used inside WishlistProvider');
  return c;
}
