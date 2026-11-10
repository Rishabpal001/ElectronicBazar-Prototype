import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gradientFor } from '../lib/format';
import { imageUrl, isConfigured } from '../lib/supabase';
import type { Product } from '../lib/types';
import { categoryIcon } from './icons';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return <div className="py-16 text-center text-muted" role="status">{label}</div>;
}
export function ErrorBox({ message }: { message: string }) {
  return <div className="card border-red-300 p-4 text-sm text-red-700 dark:text-red-300" role="alert">{message}</div>;
}
export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="card p-10 text-center"><h2 className="text-xl font-bold">{title}</h2><div className="mt-2 text-muted">{children}</div></div>;
}
export function SetupNotice() {
  if (isConfigured) return null;
  return (
    <div className="mx-auto my-6 max-w-3xl rounded-2xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
      <b>Setup needed:</b> this site was built without Supabase settings (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Add them as repository Variables and deploy again.
    </div>
  );
}

export function CardImage({ product, className = '' }: { product: Product; className?: string }) {
  const first = product.product_images?.[0];
  if (first) return <img src={imageUrl(first.path)} alt={first.alt || product.name} loading="lazy" className={`object-contain ${className}`} />;
  const Ico = categoryIcon(`${product.categories?.slug ?? ''} ${product.categories?.name ?? ''} ${product.name}`);
  return (
    <div className={`flex items-center justify-center text-white/90 ${className}`} style={{ background: gradientFor(product.id) }} role="img" aria-label={product.name}>
      <Ico className="h-1/3 w-1/3" />
    </div>
  );
}

export function ProductLink({ product, children }: { product: Product; children: ReactNode }) {
  return <Link to={`/product/${product.slug}`}>{children}</Link>;
}
