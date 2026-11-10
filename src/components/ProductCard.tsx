import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { discountPercent, formatPrice } from '../lib/format';
import type { Product } from '../lib/types';
import { CardImage } from './ui';
import { Heart } from './icons';

/** Product cards stay white in both themes so product photos look clean on the navy page. */
export default function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const off = discountPercent(product.price_minor, product.sale_price_minor);
  const liked = has(product.id);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-glow">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50" aria-label={product.name}>
        <CardImage product={product} className="h-full w-full p-3 transition duration-500 group-hover:scale-105" />
        {off > 0 && <span className="absolute right-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[11px] font-bold text-white">-{off}%</span>}
        {product.is_sample && <span className="absolute bottom-3 left-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Sample</span>}
        {!product.in_stock && <span className="absolute bottom-3 right-3 rounded-md bg-slate-700 px-2.5 py-1 text-xs font-semibold text-white">Out of stock</span>}
      </Link>
      <button type="button" onClick={() => toggle(product.id)} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-sm transition hover:scale-110 ${liked ? 'border-red-300 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'}`}>
        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      </button>
      <div className="flex flex-1 flex-col p-3.5">
        {product.brand && <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">{product.brand}</div>}
        <Link to={`/product/${product.slug}`} className="mt-0.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition group-hover:text-blue-600">{product.name}</Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-extrabold">{formatPrice(product.effective_price_minor, product.currency)}</span>
          {off > 0 && <span className="text-xs text-slate-400 line-through">{formatPrice(product.price_minor, product.currency)}</span>}
        </div>
        <Link to={`/product/${product.slug}`} className="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          {product.in_stock ? 'View & Add to Cart' : 'View details'}
        </Link>
      </div>
    </div>
  );
}
