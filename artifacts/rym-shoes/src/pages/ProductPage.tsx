import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { getProduct, getImageUrl, formatPrice, type Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';

const DEFAULT_SIZES = ['39', '40', '41', '42', '43', '44', '45'];

const COLOR_MAP: Record<string, { label: string; hex: string }> = {
  'black':      { label: 'أسود',       hex: '#1a1a1a' },
  'dark-brown': { label: 'بني غامق',   hex: '#2C1503' },
  'chocolate':  { label: 'شوكولاتة',   hex: '#3C1810' },
  'oxblood':    { label: 'أكسبلود',    hex: '#4A1C24' },
  'burgundy':   { label: 'عنابي',      hex: '#722F37' },
  'brown':      { label: 'بني',        hex: '#7B4B2A' },
  'chestnut':   { label: 'كستناء',     hex: '#954535' },
  'cognac':     { label: 'كوبياك',     hex: '#B5651D' },
  'caramel':    { label: 'كراميل',     hex: '#C49A6C' },
  'tan':        { label: 'تان',        hex: '#D2B48C' },
  'beige':      { label: 'باج',        hex: '#C4A882' },
  'taupe':      { label: 'توب',        hex: '#B09A8C' },
  'cream':      { label: 'كريمي',      hex: '#F5E6C8' },
  'white':      { label: 'أبيض',       hex: '#F5F5F0' },
  'gray':       { label: 'رمادي',      hex: '#808080' },
  'olive':      { label: 'زيتي',       hex: '#6B7A3C' },
  'forest':     { label: 'أخضر غامق',  hex: '#2C3E35' },
  'navy':       { label: 'نيلي',       hex: '#1E3A5F' },
  'blue':       { label: 'أزرق',       hex: '#2563EB' },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id!)
      .then(data => {
        setProduct(data);
        if (Array.isArray(data.colors) && data.colors.length > 0) setSelectedColor(data.colors[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product!, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 5000);
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-beige" />
          <div className="pt-8 space-y-4">
            <div className="h-4 bg-beige w-1/4" />
            <div className="h-10 bg-beige w-3/4" />
            <div className="h-8 bg-beige w-1/4" />
            <div className="h-24 bg-beige w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center">
        <p className="font-serif text-3xl font-light text-warm-gray mb-6">Product not found</p>
        <Link href="/shop" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image_url ? [product.image_url] : [];
  const activeImgUrl = images[activeImage] ? getImageUrl(images[activeImage]) : null;
  const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
  const colors = Array.isArray(product.colors) ? product.colors : [];

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs text-warm-gray mb-12 tracking-wider uppercase">
          <Link href="/" className="hover:text-warm-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-warm-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-warm-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {images.map((img, i) => {
                  const thumbUrl = getImageUrl(img);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className="w-16 h-20 bg-beige overflow-hidden flex-shrink-0 border-2 transition-all duration-200"
                      style={{ borderColor: activeImage === i ? '#2C3E35' : 'transparent' }}
                    >
                      {thumbUrl ? <img src={thumbUrl} alt={`View ${i + 1}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-beige" />}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex-1 aspect-[3/4] bg-beige overflow-hidden">
              {activeImgUrl ? (
                <img src={activeImgUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-beige">
                  <svg viewBox="0 0 200 150" width="60%" className="text-warm-black/20">
                    <path d="M30 120 Q60 90 100 85 Q140 80 170 120" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    <rect x="40" y="108" width="120" height="15" rx="3" fill="currentColor" opacity="0.15"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-3">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-warm-black leading-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-warm-black mb-8 tracking-wide">{formatPrice(product.price)} دج</p>

            {product.description && (
              <p className="text-sm leading-relaxed text-warm-gray mb-8 border-t border-beige pt-8">{product.description}</p>
            )}

            {colors.length > 0 && (
              <div className="mb-8">
                <p className="text-[9px] tracking-[0.18em] uppercase text-warm-gray mb-4">
                  Color — <span className="text-warm-black">{selectedColor ? COLOR_MAP[selectedColor]?.label : ''}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(colorId => {
                    const colorInfo = COLOR_MAP[colorId];
                    if (!colorInfo) return null;
                    return (
                      <button
                        key={colorId}
                        onClick={() => setSelectedColor(colorId)}
                        title={colorInfo.label}
                        className="w-9 h-9 rounded-full border-2 transition-all duration-200 relative"
                        style={{
                          backgroundColor: colorInfo.hex,
                          borderColor: selectedColor === colorId ? '#2C3E35' : '#e5e7eb',
                          transform: selectedColor === colorId ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {selectedColor === colorId && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                            style={{ color: colorId === 'white' || colorId === 'beige' ? '#2C3E35' : 'white' }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="text-[9px] tracking-[0.18em] uppercase text-warm-gray mb-4">Select Size (EU)</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-12 text-sm border transition-all duration-200"
                    style={{
                      background: selectedSize === size ? '#2C3E35' : 'transparent',
                      color: selectedSize === size ? '#F5F0E8' : '#1C1C1C',
                      borderColor: selectedSize === size ? '#2C3E35' : '#E8DCC8',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
              style={{ background: added ? '#2C3E35' : '#1C1C1C', color: '#F5F0E8' }}
            >
              {added ? '✓ Added to Cart - تفقد السلة' : 'Add to Cart - إضافة إلى السلة'}
            </button>

            <div className="mt-10 border-t border-beige pt-8 space-y-4">
              {[
                ['Material', 'Full-grain leather'],
                ['Sole', 'Hand-stitched leather sole'],
                ['Origin', 'Handcrafted in Italy'],
                ['Care', 'Brush & condition regularly'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-warm-gray tracking-wide">{label}</span>
                  <span className="text-warm-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
