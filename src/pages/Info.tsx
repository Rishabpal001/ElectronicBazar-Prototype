import { Link } from 'react-router-dom';
import { Bolt, Headset, Mail, Shield, Truck } from '../components/icons';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/supabase';

export function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">About <span className="text-sun">{SITE_NAME}</span></h1>
      <p className="text-muted">{SITE_NAME} is an online store for smartphones, laptops, audio, smartwatches, gaming gear and everyday accessories. Our goal is simple: Smart Choice. Better Life.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[[Bolt, 'Latest tech', 'New models and popular picks, added regularly.'], [Shield, 'Genuine products', 'Brand products with warranty details on each page.'], [Truck, 'Delivery across India', 'Order online and we ship to your door.'], [Headset, 'Real support', 'Have a question? Write to us and we will reply.']].map(([I, t, d]) => {
          const Ico = I as typeof Bolt;
          return <div key={t as string} className="card flex gap-3 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"><Ico className="h-6 w-6" /></span><div><h2 className="font-bold">{t as string}</h2><p className="text-sm text-muted">{d as string}</p></div></div>;
        })}
      </div>
      <Link to="/shop" className="btn-primary">Start shopping</Link>
    </div>
  );
}

export function Contact() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Contact us</h1>
      <div className="card space-y-4 p-6">
        <p className="text-muted">Questions about a product, an order or a payment? Send us an email and include your order number if you have one.</p>
        {CONTACT_EMAIL ? (
          <a className="btn-primary" href={`mailto:${CONTACT_EMAIL}`}><Mail className="h-4 w-4" /> {CONTACT_EMAIL}</a>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-3 text-sm text-muted">Contact email is not set yet. The site owner can add it with the VITE_CONTACT_EMAIL repository Variable.</p>
        )}
        <p className="text-sm text-muted">Already ordered? Open <Link className="underline" to="/orders">My orders</Link> to see the status and tracking.</p>
      </div>
    </div>
  );
}
