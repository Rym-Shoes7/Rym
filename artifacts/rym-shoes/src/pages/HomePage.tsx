import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import { getProducts, type Product } from '@/lib/api';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(all => setFeatured(all.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <HeroSlider />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-center">
          <Link href="/shop?category=men" className="group relative aspect-[4/5] w-full max-w-lg overflow-hidden bg-beige block">
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(to bottom, transparent, rgba(44,62,53,0.7))' }}>
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="font-serif text-3xl md:text-5xl font-light text-cream mb-3 text-center">Men's</h2>
                <p className="text-center text-xs tracking-widest uppercase border-b pb-1" style={{ color: 'rgba(245,240,232,0.7)', borderColor: 'rgba(245,240,232,0.4)' }}>
                  Shop Collection
                </p>
              </div>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 160 120" width="80%" className="text-warm-black/20 md:w-2/3">
                <path d="M20 100 Q40 80 80 75 Q120 70 140 100" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="30" y="88" width="100" height="12" rx="2" fill="currentColor" opacity="0.15"/>
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="pb-24 max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Curated for you</p>
              <h2 className="font-serif text-4xl font-light text-warm-black">Featured Pieces</h2>
            </div>
            <Link href="/shop" className="hidden md:block text-xs tracking-widest uppercase border-b border-warm-black pb-0.5 hover:text-dark-green hover:border-dark-green transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="bg-warm-black py-24 px-6 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(245,240,232,0.4)' }}>The Rym Shoes Philosophy</p>
        <h2 className="font-serif text-4xl md:text-6xl font-light text-cream max-w-3xl mx-auto leading-tight mb-8">
          "Buy less, choose well,<br /><em>make it last."</em>
        </h2>
        <Link href="/shop" className="btn-outline-light inline-block">Explore the Collection</Link>
      </section>
    </>
  );
}
