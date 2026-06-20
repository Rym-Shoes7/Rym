import { useState } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/api';

const WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو',
  'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس',
  'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر',
  'ورقلة', 'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف',
  'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة',
  'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان', 'تيميمون',
  'برج باجي مختار', 'أولاد جلال', 'بني عباس', 'إن صالح', 'إن قزام',
  'توقرت', 'جانت', 'المغير', 'المنيعة',
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', wilaya: '', commune: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const orderItems = items.map(({ product, size, qty }) => ({ name: product.name, price: product.price, size, qty }));
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: orderItems, total }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'حدث خطأ. حاول مجدداً.'); return; }
      clearCart();
      setOrderNumber(data.orderNumber);
    } catch {
      setError('تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8" style={{ background: 'rgba(44,62,53,0.1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C3E35" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-4xl font-light text-warm-black mb-4">تم تأكيد الطلب</h1>
        <p className="text-warm-gray text-sm mb-2 max-w-sm">شكراً لطلبك. سيتم التواصل معك قريباً لتأكيد التوصيل.</p>
        <p className="text-xs text-warm-gray mb-10 tracking-widest uppercase">طلب رقم #{orderNumber}</p>
        <Link href="/shop" className="btn-primary inline-block">مواصلة التسوق</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen max-w-5xl mx-auto px-6 pb-24" dir="rtl">
      <h1 className="font-serif text-5xl font-light mb-16">إتمام الطلب</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">معلومات المشتري</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">الاسم الأول</label>
                  <input required name="firstName" value={form.firstName} onChange={handleChange} type="text" className="input-field" placeholder="الإسم" />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">اللقب</label>
                  <input required name="lastName" value={form.lastName} onChange={handleChange} type="text" className="input-field" placeholder="إسم العائلة" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">رقم الهاتف</label>
                <input required name="phone" value={form.phone} onChange={handleChange} type="tel" className="input-field" placeholder="05 XX XX XX XX" dir="ltr" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-light mb-6">عنوان التوصيل</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">العنوان الكامل</label>
                <input required name="address" value={form.address} onChange={handleChange} type="text" className="input-field" placeholder="رقم، شارع، حي..." />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">الولاية</label>
                <select required name="wilaya" value={form.wilaya} onChange={handleChange} className="input-field bg-white">
                  <option value="" disabled>اختر الولاية</option>
                  {WILAYAS.map((w, i) => <option key={i} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">البلدية</label>
                <input required name="commune" value={form.commune} onChange={handleChange} type="text" className="input-field" placeholder="البلدية" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-light mb-6">طريقة الدفع</h2>
            <div className="p-6 border border-beige flex items-center gap-4" style={{ background: 'rgba(232,220,200,0.4)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,62,53,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C3E35" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-black">الدفع عند الاستلام</p>
                <p className="text-xs text-warm-gray mt-0.5">ادفع نقداً عند وصول طلبك</p>
              </div>
              <div className="mr-auto">
                <div className="w-4 h-4 rounded-full bg-dark-green border-2 border-dark-green flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cream" />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading || items.length === 0}
            className="w-full py-4 bg-warm-black text-cream text-xs font-semibold tracking-[0.2em] hover:bg-dark-green transition-colors duration-300 disabled:opacity-50">
            {loading ? 'جاري تأكيد الطلب...' : <>تأكيد الطلب — <span dir="ltr">{formatPrice(total)} دج</span></>}
          </button>
        </form>

        <div className="bg-cream border border-beige p-8 h-fit">
          <h2 className="font-serif text-2xl font-light mb-8">ملخص الطلب</h2>
          {items.length === 0 ? (
            <p className="text-sm text-warm-gray">سلتك فارغة. <Link href="/shop" className="underline">تسوق الآن</Link></p>
          ) : (
            <div className="space-y-6">
              {items.map(({ key, product, size, qty }) => (
                <div key={key} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-warm-gray text-xs mt-1">SIZE {size} × {qty}</p>
                  </div>
                  <span dir="ltr">{formatPrice(parseFloat(product.price) * qty)} DA</span>
                </div>
              ))}
              <div className="border-t border-beige pt-4 flex justify-between font-semibold">
                <span>TOTAL</span>
                <span dir="ltr">{formatPrice(total)} DA</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
