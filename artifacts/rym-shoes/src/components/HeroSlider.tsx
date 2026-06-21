import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLang } from '@/context/LanguageContext';

const base = import.meta.env.BASE_URL ?? '/';

const slides = [
  { src: `${base}hero1.jpg`, alt: 'Luxury loafers on wood floor' },
  { src: `${base}hero2.jpg`, alt: 'Black loafers outdoor lifestyle' },
  { src: `${base}hero3.jpg`, alt: 'Black horsebit loafers closeup' },
];

export default function HeroSlider() {
  const { t, isRTL } = useLang();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    if (index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  };

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-dark-green">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? (animating ? 0 : 1) : 0 }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
      ))}

      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,62,53,0.4), rgba(44,62,53,0.3), rgba(44,62,53,0.8))' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 lg:pb-32" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: 'rgba(245,240,232,0.6)' }}>
            {isRTL ? 'تشكيلة ربيع / صيف 2025' : 'Collection Printemps / Été 2025'}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream leading-[1.0] mb-8">
            {isRTL ? (
              <>أحذية خارج الزمن<br /><em className="italic font-light">للأناقة</em><br />العصرية.</>
            ) : (
              <>Chaussures<br /><em className="italic font-light">pour l&apos;Élégance</em><br />Moderne.</>
            )}
          </h1>
          <p className="text-sm md:text-base font-light leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(245,240,232,0.6)' }}>
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/shop" className="btn-outline-light">{t.shopNow}</Link>
            <Link href="/shop?category=men" className="text-xs tracking-widest uppercase underline underline-offset-4 self-center hover:text-cream transition-colors" style={{ color: 'rgba(245,240,232,0.6)' }}>
              {t.viewMens}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? '2rem' : '0.375rem',
                  height: i === current ? '0.375rem' : '0.375rem',
                  backgroundColor: i === current ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(245,240,232,0.4)' }}>{t.scroll}</span>
        <div className="w-px h-12" style={{ background: 'rgba(245,240,232,0.2)' }} />
      </div>
    </section>
  );
}
