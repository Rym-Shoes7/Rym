import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { getProducts, type Product } from '@/lib/api';

export default function ShopPage() {
  const params = new URLSearchParams(window.location.search);
  const initCategory = params.get('category') || 'all';
  const [category, setCategory] = useState(initCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts(category)
      .then(setProducts)
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [category]);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'men', label: "Men's" },
  ];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="mb-16 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-warm-gray mb-3">Curated footwear</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-warm-black">The Collection</h1>
      </div>

      <div className="flex justify-center mb-16">
        <div className="flex gap-0 border border-beige">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className="px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-200"
              style={{
                background: category === c.value ? '#2C3E35' : 'transparent',
                color: category === c.value ? '#F5F0E8' : '#6B6560',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-beige mb-4" />
              <div className="h-3 bg-beige rounded mb-2 w-1/3" />
              <div className="h-5 bg-beige rounded mb-2 w-3/4" />
              <div className="h-4 bg-beige rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-warm-gray text-sm mb-4">{error}</p>
          <button onClick={() => setCategory(category)} className="btn-outline">Retry</button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-3xl font-light text-warm-gray mb-4">No products found</p>
          <p className="text-sm text-warm-gray">Check back soon for new arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
