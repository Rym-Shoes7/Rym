import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/admin/dashboard');
    } catch {
      setError('البريد الإلكتروني أو كلمة السر غير صحيحة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-light text-warm-black tracking-widest mb-2">Rym SHOES</h1>
          <p className="text-[9px] tracking-[0.25em] uppercase text-warm-gray">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Email</label>
            <input
              type="email" required autoComplete="email"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="admin-input" placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Password</label>
            <input
              type="password" required autoComplete="current-password"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="admin-input" placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-dark-green text-cream text-xs font-semibold tracking-[0.2em] uppercase hover:bg-forest transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
