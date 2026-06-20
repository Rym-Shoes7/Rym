import { Link } from 'wouter';

const socials = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/213540506385',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-warm-black pt-16 pb-8 mt-24" style={{ color: 'rgba(245,240,232,0.7)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-cream mb-3 tracking-widest">Rym SHOES</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>
                Des chaussures élégantes pour ceux qui savent que le vrai luxe ne crie pas.
              </p>
            </div>
            <div className="space-y-3">
              <a href="tel:+213540506385" className="flex items-center gap-3 text-sm hover:text-cream transition-colors group" style={{ color: 'rgba(245,240,232,0.6)' }}>
                <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <span dir="ltr">+213 540506385</span>
              </a>
              <div className="flex items-start gap-3 text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
                <span>Biskra / Algérie</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(245,240,232,0.4)' }}>Suivez-nous</p>
              <div className="flex gap-3">
                {socials.map(({ name, href, icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:text-cream hover:border-white/50 transition-all duration-300"
                    style={{ color: 'rgba(245,240,232,0.5)' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Boutique</h5>
            <ul className="space-y-3">
              {([['Nouveautés', '/shop'], ['Homme', '/shop?category=men'], ['Femme', '/shop?category=women'], ['Tous les produits', '/shop']] as [string, string][]).map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-cream transition-colors" style={{ color: 'rgba(245,240,232,0.5)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Aide</h5>
            <ul className="space-y-3">
              {["Guide des tailles", "Livraison et retours", "Conseils d'entretien", "Contactez-nous"].map(label => (
                <li key={label}>
                  <a href="#" className="text-sm hover:text-cream transition-colors" style={{ color: 'rgba(245,240,232,0.5)' }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Entreprise</h5>
            <ul className="space-y-3">
              {["Notre histoire", "L'artisanat", "Durabilité", "Cliquez ici"].map(label => (
                <li key={label}>
                  <a href="#" className="text-sm hover:text-cream transition-colors" style={{ color: 'rgba(245,240,232,0.5)' }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-wider" style={{ color: 'rgba(245,240,232,0.3)' }}>
            © 2026 Rym Shoes. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>
            <a href="#" className="hover:text-cream transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-cream transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
