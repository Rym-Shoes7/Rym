const API_BASE = '/api';

export interface Product {
  id: number;
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
  id: number;
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

export async function getProducts(category = 'all'): Promise<Product[]> {
  const url = category && category !== 'all'
    ? `${API_BASE}/products?category=${category}`
    : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string | number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export function getImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE.replace('/api', '')}${imageUrl}`;
}

export function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
}

export function formatPrice(price: string | number): string {
  return Math.round(parseFloat(String(price))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
