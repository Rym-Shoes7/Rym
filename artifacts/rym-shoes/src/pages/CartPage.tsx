import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { getImageUrl, formatPrice } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, count } = useCart();

  return (
    <>
      <Navbar />

      {count === 0 ? (
        <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-8 opacity-20">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-light text-warm-black mb-4">Your cart is empty</h1>
          <p className="text-warm-gray text-sm mb-8">Discover our curated collection of timeless footwear.</p>
          <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6 pb-24">
          <h1 className="font-serif text-5xl font-light text-warm-black mb-16">Your Cart - سلتك</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {items.map(({ key, product, size, color, qty }) => {
                const imgUrl = getImageUrl(product.image_url);
                return (
                  <div key={key} className="flex gap-6 py-8 border-b border-beige">
                    <div className="w-28 h-36 bg-beige flex-shrink-0 overflow-hidden">
                      {imgUrl ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-beige" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] tracking-[0.18em] uppercase text-warm-gray mb-1">{product.category}</p>
                      <h3 className="font-serif text-xl font-light mb-1">{product.name}</h3>
                      <p className="text-xs text-warm-gray mb-1">Size EU {size}{color ? ` · ${color}` : ''}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-beige">
                          <button onClick={() => updateQty(key, qty - 1)} className="px-3 py-2">−</button>
                          <span className="px-4 py-2 text-sm border-x border-beige">{qty}</span>
                          <button onClick={() => updateQty(key, qty + 1)} className="px-3 py-2">+</button>
                        </div>
                        <p className="font-semibold">{formatPrice(parseFloat(product.price) * qty)} DA</p>
                      </div>
                      <button onClick={() => removeFromCart(key)} className="mt-3 text-[9px] tracking-widest uppercase text-warm-gray hover:text-warm-black underline">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-cream border border-beige p-8 h-fit">
              <h2 className="font-serif text-2xl font-light mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">Subtotal ({count} items)</span>
                  <span>{formatPrice(total)} DA</span>
                </div>
                <div className="border-t border-beige pt-4 flex justify-between font-semibold">
                  <span>Total - المجموع</span>
                  <span>{formatPrice(total)} DA</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full text-center btn-primary">Proceed to Checkout - إتمام الطلب</Link>
              <Link href="/shop" className="block text-center mt-4 text-xs tracking-widest uppercase text-warm-gray hover:text-warm-black">
                Continue Shopping - متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
