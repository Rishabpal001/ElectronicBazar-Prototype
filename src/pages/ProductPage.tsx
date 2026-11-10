import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizationForm from '../components/CustomizationForm';
import { CardImage, Empty, ErrorBox, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getFieldsFor, getProductBySlug, uploadPersonalPhoto } from '../lib/api';
import { cleanCustomization, resolveFields, validateCustomization } from '../lib/customization';
import { deliveryText, discountPercent, formatPrice } from '../lib/format';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Return, Shield, Truck } from '../components/icons';
import { clampQty, lineTotals, maxQuantity } from '../lib/pricing';
import { imageUrl } from '../lib/supabase';
import type { Customization, CustomizationField, Product } from '../lib/types';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [allFields, setAllFields] = useState<CustomizationField[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Customization>({});
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const wish = useWishlist();

  useEffect(() => {
    let live = true;
    setProduct(undefined); setErr(null);
    getProductBySlug(slug)
      .then(async (p) => {
        if (!live) return;
        setProduct(p);
        if (p) {
          setAllFields(await getFieldsFor([p.id]));
          const v = p.product_variants?.[0];
          setVariantId(v?.id ?? '');
        }
      })
      .catch((e: Error) => { if (live) setErr(e.message); });
    return () => { live = false; };
  }, [slug]);

  const fields = useMemo(() => (product ? resolveFields(product, allFields) : []), [product, allFields]);
  const variant = product?.product_variants?.find((v) => v.id === variantId) ?? null;

  if (err) return <ErrorBox message={err} />;
  if (product === undefined) return <Spinner />;
  if (product === null) return <Empty title="Product not found"><Link className="underline" to="/shop">Back to the shop</Link></Empty>;

  const max = maxQuantity(product, variant);
  const soldOut = max === 0;
  const q = clampQty(qty, Math.max(1, max));
  const filledValues: Customization = { ...values };
  for (const k of Object.keys(files)) if (files[k]) filledValues[k] = 'pending-upload';
  const totals = lineTotals(product, variant, q, fields, filledValues);
  const images = product.product_images ?? [];
  const delivery = deliveryText(product.delivery_min_days, product.delivery_max_days);

  async function addToCart() {
    if (!product) return;
    setErr(null);
    const e = validateCustomization(fields, values, Object.fromEntries(Object.entries(files).map(([k, f]) => [k, f ? { type: f.type, size: f.size } : undefined])));
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const clean = cleanCustomization(fields.filter((f) => f.field_type !== 'photo'), values);
      const withPhotos: Customization = { ...clean };
      for (const f of fields) {
        const file = files[f.key];
        if (f.field_type === 'photo' && file) {
          if (!user) throw new Error('Please sign in to upload a photo.');
          withPhotos[f.key] = await uploadPersonalPhoto(user.id, file);
        }
      }
      await add({ product_id: product.id, variant_id: variant?.id ?? null, quantity: q, customization: withPhotos });
      nav('/cart');
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not add to cart.');
    } finally {
      setBusy(false);
    }
  }

  const off = discountPercent(product.price_minor, product.sale_price_minor);
  const liked = wish.has(product.id);

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-accent">Home</Link> / <Link to="/shop" className="hover:text-accent">Shop</Link>
        {product.categories && <> / <Link to={`/shop?category=${product.categories.slug}`} className="hover:text-accent">{product.categories.name}</Link></>}
        <> / <span className="font-semibold text-ink">{product.name}</span></>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {images.length > 1 && (
            <div className="flex gap-2 sm:flex-col">
              {images.map((im, i) => (
                <button key={im.id} onClick={() => setImgIdx(i)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white ${i === imgIdx ? 'border-accent' : 'border-line'}`} aria-label={`Show image ${i + 1}`}>
                  <img src={imageUrl(im.path)} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            {images[imgIdx] ? <img src={imageUrl(images[imgIdx].path)} alt={images[imgIdx].alt || product.name} className="h-full w-full object-contain p-6" /> : <CardImage product={product} className="h-full w-full" />}
            {off > 0 && <span className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-bold text-white">{off}% OFF</span>}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            {product.brand && <div className="text-sm font-bold uppercase tracking-wider text-accent">{product.brand}</div>}
            <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className={`rounded-md px-2 py-0.5 font-semibold ${soldOut ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'}`}>{soldOut ? 'Out of stock' : 'In Stock'}</span>
              {product.is_sample && <span className="text-muted">Sample product for testing.</span>}
              <span className="text-muted">SKU: {product.sku}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-extrabold">{formatPrice(totals.unit, product.currency)}</span>
              {product.sale_price_minor != null && <span className="text-lg text-muted line-through">{formatPrice(product.price_minor, product.currency)}</span>}
              {off > 0 && <span className="rounded-md bg-red-500 px-2 py-1 text-sm font-bold text-white">{off}% OFF</span>}
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes.</p>
            {delivery && <p className="mt-1 text-sm text-muted">{delivery}</p>}
          </div>
          {product.description && <p className="whitespace-pre-line text-muted">{product.description}</p>}

          {(product.highlights?.length ?? 0) > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Key specifications">
              {product.highlights.map((h) => <li key={h.label} className="card p-3"><div className="text-sm font-bold">{h.value}</div><div className="text-xs text-muted">{h.label}</div></li>)}
            </ul>
          )}

          {(product.product_variants?.length ?? 0) > 0 && (
            <div>
              <label className="label" htmlFor="variant">Choose option</label>
              <select id="variant" className="input" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                {product.product_variants?.map((v) => <option key={v.id} value={v.id}>{v.label}{v.price_delta_minor ? ` (+${formatPrice(v.price_delta_minor)})` : ''}</option>)}
              </select>
            </div>
          )}

          {(product.product_price_tiers?.length ?? 0) > 0 && (
            <p className="text-sm text-muted">Bulk price: {product.product_price_tiers?.map((t) => `${t.min_qty}+ units ${formatPrice(t.unit_price_minor)} each`).join(' · ')}</p>
          )}

          <CustomizationForm fields={fields} values={values} files={files} errors={errors} signedIn={Boolean(user)}
            onValue={(k, v) => setValues((s) => ({ ...s, [k]: v }))} onFile={(k, f) => setFiles((s) => ({ ...s, [k]: f }))} />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-full border border-line bg-surface">
              <button type="button" className="h-11 w-11 text-lg font-bold hover:bg-accent/15 disabled:opacity-40" disabled={soldOut || q <= 1} onClick={() => setQty(q - 1)} aria-label="Decrease quantity">−</button>
              <label className="sr-only" htmlFor="qty">Quantity</label>
              <input id="qty" type="number" min={1} max={Math.max(1, max)} className="h-11 w-14 bg-transparent text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" value={q} disabled={soldOut} onChange={(e) => setQty(Number(e.target.value))} />
              <button type="button" className="h-11 w-11 text-lg font-bold hover:bg-accent/15 disabled:opacity-40" disabled={soldOut || q >= max} onClick={() => setQty(q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn-primary h-11 flex-1 px-6 text-base" disabled={busy || soldOut} onClick={addToCart}>
              {soldOut ? 'Out of stock' : busy ? 'Adding…' : `Add to Cart · ${formatPrice(totals.total, product.currency)}`}
            </button>
            <button type="button" onClick={() => wish.toggle(product.id)} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'} className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${liked ? 'border-red-400 bg-red-500/15 text-red-500' : 'border-line bg-surface hover:border-accent hover:text-accent'}`}>
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>
          {product.track_inventory && max > 0 && max <= 5 && <p className="text-sm font-semibold text-amber-500">Only {max} left in stock.</p>}
          {totals.charge > 0 && <p className="text-sm text-muted">Includes {formatPrice(totals.charge)} per item for the options you chose.</p>}
          {err && <ErrorBox message={err} />}

          <ul className="card grid gap-4 p-4 sm:grid-cols-3">
            <li className="flex items-center gap-2.5 text-sm"><Truck className="h-7 w-7 text-accent" /><span><b className="block">Fast Delivery</b><span className="text-muted">Across India</span></span></li>
            <li className="flex items-center gap-2.5 text-sm"><Shield className="h-7 w-7 text-accent" /><span><b className="block">{product.warranty || 'Genuine product'}</b><span className="text-muted">{product.warranty ? 'Warranty' : 'Secure payment'}</span></span></li>
            <li className="flex items-center gap-2.5 text-sm"><Return className="h-7 w-7 text-accent" /><span><b className="block">Support</b><span className="text-muted">Write to us anytime</span></span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
