import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getProducts, getOrders, adminDeleteProduct, adminUpdateOrderStatus,
  getImageUrl, formatPrice, type Product, type Order,
} from '@/lib/api';

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prods);
      setOrders(ords);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuthChecked(true);
      if (!user) {
        navigate('/admin/login');
      } else {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [fetchData, navigate]);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await adminDeleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await adminUpdateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-dark-green text-cream px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl tracking-widest">Rym SHOES</span>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs tracking-widest uppercase opacity-70 hover:opacity-100">← Store</Link>
          <button onClick={logout} className="text-xs tracking-widest uppercase opacity-70 hover:opacity-100">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-light text-warm-black">Dashboard</h1>
            <div className="flex gap-6 mt-2 text-sm text-warm-gray">
              <span>{products.length} products</span>
              <span>{orders.length} orders</span>
            </div>
          </div>
          <Link href="/admin/products/new" className="btn-primary inline-block">+ New Product</Link>
        </div>

        <div className="flex gap-0 border border-beige mb-8 w-fit">
          {(['products', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all"
              style={{ background: tab === t ? '#2C3E35' : 'transparent', color: tab === t ? '#F5F0E8' : '#6B6560' }}>
              {t === 'products' ? 'Products' : 'Orders'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-beige animate-pulse rounded" />)}
          </div>
        ) : tab === 'products' ? (
          products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-warm-gray mb-4">No products yet.</p>
              <Link href="/admin/products/new" className="btn-primary inline-block">Add First Product</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const imgUrl = getImageUrl(product.image_url);
                return (
                  <div key={product.id} className="bg-white border border-beige overflow-hidden group">
                    <div className="aspect-[3/4] bg-beige overflow-hidden relative">
                      {imgUrl ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-beige" />}
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] text-warm-gray uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="font-serif text-base font-light truncate mb-1">{product.name}</h3>
                      <p className="text-sm font-semibold mb-4">{formatPrice(product.price)} DA</p>
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="flex-1 py-2 text-center text-[10px] tracking-widest uppercase border border-dark-green text-dark-green hover:bg-dark-green hover:text-cream transition-all">
                          Edit
                        </Link>
                        <button onClick={() => deleteProduct(product.id)}
                          className="px-3 py-2 text-[10px] border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          orders.length === 0 ? (
            <div className="text-center py-24"><p className="text-warm-gray">No orders yet.</p></div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items as Array<{ name: string; size: string; qty: number }>;
                return (
                  <div key={order.id} className="bg-white border border-beige p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold">{order.order_number ?? `#${order.id.substring(0, 8)}`} — {order.first_name} {order.last_name}</p>
                        <p className="text-sm text-warm-gray mt-1">{order.phone} · {order.wilaya}</p>
                        <p className="text-xs text-warm-gray mt-0.5">{order.address}, {order.commune}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-beige px-3 py-2 bg-white">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <span className="font-semibold text-sm whitespace-nowrap">{formatPrice(order.total)} DA</span>
                      </div>
                    </div>
                    <div className="border-t border-beige pt-4">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(items) && items.map((item, i) => (
                          <span key={i} className="text-xs bg-beige px-3 py-1.5">
                            {item.name} — EU {item.size} × {item.qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
