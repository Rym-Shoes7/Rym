import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { adminFetch } from '@/lib/api';

const ALL_SIZES = ['39', '40', '41', '42', '43', '44', '45', '46'];
const ALL_COLORS = [
  { id: 'black',      label: 'أسود',       hex: '#1a1a1a' },
  { id: 'dark-brown', label: 'بني غامق',   hex: '#2C1503' },
  { id: 'chocolate',  label: 'شوكولاتة',   hex: '#3C1810' },
  { id: 'oxblood',    label: 'أكسبلود',    hex: '#4A1C24' },
  { id: 'burgundy',   label: 'عنابي',      hex: '#722F37' },
  { id: 'brown',      label: 'بني',        hex: '#7B4B2A' },
  { id: 'chestnut',   label: 'كستناء',     hex: '#954535' },
  { id: 'cognac',     label: 'كوبياك',     hex: '#B5651D' },
  { id: 'caramel',    label: 'كراميل',     hex: '#C49A6C' },
  { id: 'tan',        label: 'تان',        hex: '#D2B48C' },
  { id: 'beige',      label: 'باج',        hex: '#C4A882' },
  { id: 'taupe',      label: 'توب',        hex: '#B09A8C' },
  { id: 'cream',      label: 'كريمي',      hex: '#F5E6C8' },
  { id: 'white',      label: 'أبيض',       hex: '#F5F5F0' },
  { id: 'gray',       label: 'رمادي',      hex: '#808080' },
  { id: 'olive',      label: 'زيتي',       hex: '#6B7A3C' },
  { id: 'forest',     label: 'أخضر غامق',  hex: '#2C3E35' },
  { id: 'navy',       label: 'نيلي',       hex: '#1E3A5F' },
  { id: 'blue',       label: 'أزرق',       hex: '#2563EB' },
];

export default function NewProductPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'men' });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSize = (size: string) =>
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const toggleColor = (id: string) =>
    setSelectedColors(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeImage = (i: number) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('sizes', JSON.stringify(selectedSizes));
    fd.append('colors', JSON.stringify(selectedColors));
    imageFiles.forEach(file => fd.append('images', file));
    try {
      const res = await adminFetch('/products', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-dark-green text-cream px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-serif text-xl tracking-widest">Rym SHOES</Link>
        <Link href="/admin/dashboard" className="text-xs tracking-widest uppercase opacity-70 hover:opacity-100">← Back</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-light text-warm-black mb-12">New Product</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-8">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Product Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="admin-input" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Price (دج) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="admin-input" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="admin-input">
                <option value="men">Men's</option>
                <option value="women">Women's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Description</label>
              <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="admin-input resize-none" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-4">Available Sizes (EU)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className="w-12 h-12 text-sm border-2 transition-all duration-200 font-medium"
                  style={{ background: selectedSizes.includes(size) ? '#2C3E35' : 'white', color: selectedSizes.includes(size) ? '#F5F0E8' : '#1C1C1C', borderColor: selectedSizes.includes(size) ? '#2C3E35' : '#E8DCC8' }}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-4">Available Colors</label>
            <div className="flex flex-wrap gap-3">
              {ALL_COLORS.map(color => (
                <button key={color.id} type="button" onClick={() => toggleColor(color.id)}
                  className="flex items-center gap-2 px-3 py-2 border-2 transition-all duration-200 text-xs"
                  style={{ borderColor: selectedColors.includes(color.id) ? '#2C3E35' : '#E8DCC8', background: selectedColors.includes(color.id) ? 'rgba(44,62,53,0.05)' : 'white' }}>
                  <span className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                  <span className="text-warm-black font-medium">{color.label}</span>
                  {selectedColors.includes(color.id) && <span className="text-dark-green">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-4">
              Product Images {imagePreviews.length > 0 && `(${imagePreviews.length})`}
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group aspect-[3/4] bg-beige overflow-hidden">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 bg-dark-green text-cream text-[8px] px-1.5 py-0.5 tracking-wider uppercase">Main</span>}
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer border-2 border-dashed border-beige p-5 text-center bg-white flex flex-col items-center gap-2 hover:border-dark-green transition-colors block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-gray">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-xs text-warm-gray">Click to upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link href="/admin/dashboard" className="btn-outline inline-block">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
