import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';

export default function Navbar() {
  const { count } = useCart();
  const { lang, t, toggleLang, isRTL } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(4px)' : 'none', boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="2" y1="5" x2="20" y2="5"/><line x1="2" y1="11" x2="20" y2="11"/><line x1="2" y1="17" x2="20" y2="17"/>
            </svg>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className="nav-link">{t.shop}</Link>
            <Link href="/shop?category=men" className="nav-link">{t.men}</Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/logo.png"
              alt="Rym SHOES"
              className="h-12 w-auto object-contain"
              style={{ filter: scrolled ? 'none' : 'brightness(0) invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.6))' }}
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="hidden lg:flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold border border-current px-2.5 py-1 hover:bg-dark-green hover:text-cream hover:border-dark-green transition-all duration-200"
            >
              {lang === 'ar' ? 'FR' : 'عر'}
            </button>
            <Link href="/login" className="hidden lg:block nav-link">{t.account}</Link>
            <Link href="/cart" className="relative p-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0 -right-0 bg-dark-green text-cream text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-warm-black/40" />
          <div className="absolute top-0 left-0 w-72 h-full bg-cream p-8" onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
            <button onClick={() => setMobileOpen(false)} className="mb-8 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>
            <nav className="flex flex-col gap-6">
              {([['/', t.home], ['/shop', t.shop], ['/shop?category=men', t.men], ['/cart', t.cart], ['/login', t.account]] as [string, string][]).map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl font-light text-warm-black hover:text-dark-green transition-colors">
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); }}
                className="text-left font-serif text-2xl font-light text-warm-black hover:text-dark-green transition-colors"
              >
                {lang === 'ar' ? 'Français' : 'العربية'}
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
