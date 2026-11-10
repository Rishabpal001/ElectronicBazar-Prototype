import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Empty, ErrorBox, Spinner } from '../components/ui';
import { useWishlist } from '../context/WishlistContext';
import { getProductsByIds } from '../lib/api';
import { isConfigured } from '../lib/supabase';
import type { Product } from '../lib/types';

export default function Wishlist() {
  const { ids } = useWishlist();
  const [items, setItems] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const key = ids.join(',');
  useEffect(() => {
    if (!isConfigured || ids.length === 0) { setItems([]); return; }
    let live = true;
    getProductsByIds(ids).then((r) => { if (live) setItems(r.filter((p) => p.is_active)); }).catch((e: Error) => { if (live) setErr(e.message); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Your wishlist</h1>
      {err ? <ErrorBox message={err} /> : items === null ? <Spinner /> : items.length === 0 ? (
        <Empty title="Nothing saved yet">Tap the heart on any product to save it here. <Link className="underline" to="/shop">Browse products</Link></Empty>
      ) : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      <p className="text-xs text-muted">Your wishlist is saved in this browser only.</p>
    </div>
  );
}
