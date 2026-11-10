import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const rootEl = document.getElementById('root') as HTMLElement;

function showFatal(title: string, detail: string) {
  rootEl.innerHTML = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:20px;border:1px solid #fca5a5;background:#fef2f2;border-radius:12px;color:#7f1d1d">
      <h2 style="margin:0 0 8px">${title}</h2>
      <pre style="white-space:pre-wrap;word-break:break-word;font-size:13px;margin:0">${detail
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</pre>
    </div>`;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error('App crashed:', error);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto', padding: 20, border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 12, color: '#7f1d1d' }}>
          <h2 style={{ margin: '0 0 8px' }}>App me error aaya</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, margin: 0 }}>
            {String(this.state.error.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

async function boot() {
  const missing: string[] = [];
  if (!import.meta.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');
  if (missing.length) {
    showFatal(
      'Config missing',
      `Ye GitHub Variables set nahi hain: ${missing.join(', ')}\n\nRepo -> Settings -> Secrets and variables -> Actions -> Variables me add karo, phir Actions me deploy dobara run karo.`,
    );
    return;
  }

  try {
    const [{ BrowserRouter }, { default: App }, { AuthProvider }, { CartProvider }, { WishlistProvider }] =
      await Promise.all([
        import('react-router-dom'),
        import('./App'),
        import('./context/AuthContext'),
        import('./context/CartContext'),
        import('./context/WishlistContext'),
      ]);

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    );
  } catch (e) {
    console.error(e);
    showFatal('Startup error', e instanceof Error ? `${e.message}\n\n${e.stack ?? ''}` : String(e));
  }
}

boot();
