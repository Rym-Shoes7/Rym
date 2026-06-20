import { Link } from 'wouter';
import { type Product, getImageUrl, formatPrice } from '@/lib/api';

const PLACEHOLDER_COLORS: Record<string, string> = {
  men: '#2C3E35',
  women: '#C4A882',
  unisex: '#6B6560',
};

export default function ProductCard({ product }: { product: Product }) {
  const imgUrl = getImageUrl(product.image_url);

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-[3/4] bg-beige mb-4">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.name}
              className="w-full h-full object-cover product-card-img"
            />
          ) : (
            <div
              className="w-full h-full flex items-end justify-center pb-8"
              style={{ background: `linear-gradient(135deg, ${PLACEHOLDER_COLORS[product.category] || '#C4A882'}22, ${PLACEHOLDER_COLORS[product.category] || '#C4A882'}55)` }}
            >
              <svg viewBox="0 0 120 60" width="100" className="opacity-30">
                <path d="M10 50 C30 50 30 20 60 20 C90 20 90 50 110 50" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M10 50 L5 45 M110 50 L115 45" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <ellipse cx="60" cy="52" rx="50" ry="4" fill="currentColor" opacity="0.15"/>
              </svg>
            </div>
          )}
          <div className="absolute inset-0 transition-colors duration-300" style={{ background: 'rgba(28,28,28,0)' }} />
          <div className="absolute bottom-4 left-4 right-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase
            translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-300 bg-cream text-warm-black text-center hover:bg-dark-green hover:text-cream">
            View Product
          </div>
        </div>
        <div className="px-1">
          <p className="text-[9px] tracking-[0.18em] uppercase text-warm-gray mb-1">{product.category}</p>
          <h3 className="font-serif text-lg font-light text-warm-black leading-tight mb-2">{product.name}</h3>
          <p className="text-sm font-semibold text-warm-black tracking-wide">{formatPrice(product.price)} دج</p>
        </div>
      </Link>
    </div>
  );
}
