import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  category: string;
  image_url?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  created_at?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  wilaya: string;
  commune: string;
  items: unknown;
  total: string;
  status: string;
  created_at: string;
}

export function getImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  return imageUrl;
}

export function formatPrice(price: string | number): string {
  return Math.round(parseFloat(String(price))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

async function uploadImage(file: File): Promise<string> {
  const name = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileRef = ref(storage, `products/${name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function getProducts(category = 'all'): Promise<Product[]> {
  const col = collection(db, 'products');
  const q = category !== 'all'
    ? query(col, where('category', '==', category), orderBy('created_at', 'desc'))
    : query(col, orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string): Promise<Product> {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) throw new Error('Product not found');
  return { id: snap.id, ...snap.data() } as Product;
}

export async function adminCreateProduct(
  data: { name: string; price: string; description: string; category: string; sizes: string[]; colors: string[] },
  imageFiles: File[],
): Promise<void> {
  const urls = await Promise.all(imageFiles.map(uploadImage));
  await addDoc(collection(db, 'products'), {
    ...data,
    image_url: urls[0] ?? '',
    images: urls,
    created_at: new Date().toISOString(),
  });
}

export async function adminUpdateProduct(
  id: string,
  data: { name: string; price: string; description: string; category: string; sizes: string[]; colors: string[] },
  newImageFiles: File[],
  keepUrls: string[],
): Promise<void> {
  const newUrls = await Promise.all(newImageFiles.map(uploadImage));
  const allImages = [...keepUrls, ...newUrls];
  await updateDoc(doc(db, 'products', id), {
    ...data,
    image_url: allImages[0] ?? '',
    images: allImages,
  });
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status });
}

export async function placeOrder(orderData: {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  wilaya: string;
  commune: string;
  items: Array<{ name: string; price: string; size: string; qty: number }>;
  total: number;
}): Promise<{ orderNumber: string }> {
  const orderNumber = `RYM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  await addDoc(collection(db, 'orders'), {
    ...orderData,
    order_number: orderNumber,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
  sendTelegram(orderNumber, orderData).catch(() => {});
  return { orderNumber };
}

async function sendTelegram(
  orderNumber: string,
  data: Parameters<typeof placeOrder>[0],
): Promise<void> {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;
  if (!token || !chatId) return;
  const items = data.items.map(i => `• ${i.name} (EU ${i.size} × ${i.qty})`).join('\n');
  const text = `🛍️ <b>طلب جديد!</b>\n\n📦 <b>${orderNumber}</b>\n👤 ${data.first_name} ${data.last_name}\n📞 ${data.phone}\n📍 ${data.wilaya}, ${data.commune}\n🏠 ${data.address}\n\n${items}\n\n💰 <b>المجموع: ${data.total} دج</b>`;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`/api${endpoint}`, options);
}
