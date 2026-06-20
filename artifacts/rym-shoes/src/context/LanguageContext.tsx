import { createContext, useContext, useState, type ReactNode } from 'react';

export const translations = {
  ar: {
    shop: 'المتجر',
    men: 'رجالي',
    account: 'الحساب',
    cart: 'السلة',
    home: 'الرئيسية',
    shopNow: 'تسوق الآن',
    viewMens: 'تصفح الرجالي ←',
    collection: 'المجموعة',
    featuredPieces: 'أبرز المنتجات',
    viewAll: 'عرض الكل',
    curatedForYou: 'مختار لك',
    mensCollection: 'تشكيلة الرجال',
    shopCollection: 'تسوق المجموعة',
    yourCart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة',
    discoverCollection: 'اكتشف تشكيلتنا من الأحذية الراقية.',
    continueShopping: 'مواصلة التسوق',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    freeShipping: 'مجاني',
    total: 'الإجمالي',
    proceedToCheckout: 'إتمام الطلب',
    size: 'المقاس',
    remove: 'حذف',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    signInToAccount: 'ادخل إلى حسابك',
    joinCircle: 'انضم إلى عائلة Rym Shoes',
    scroll: 'مرر',
    timelessShoes: 'أحذية خارج الزمن',
    forModernElegance: 'للأناقة العصرية',
    heroSubtitle: 'كل زوج هو بيان هادئ. مصنوع لمن يفهم أن الفخامة الحقيقية تتكلم بصمت.',
  },
  fr: {
    shop: 'Boutique',
    men: 'Homme',
    account: 'Compte',
    cart: 'Panier',
    home: 'Accueil',
    shopNow: 'Acheter',
    viewMens: 'Voir Homme →',
    collection: 'Collection',
    featuredPieces: 'Pièces Vedettes',
    viewAll: 'Voir tout',
    curatedForYou: 'Sélectionné pour vous',
    mensCollection: 'Collection Homme',
    shopCollection: 'Voir la collection',
    yourCart: 'Votre Panier',
    emptyCart: 'Votre panier est vide',
    discoverCollection: 'Découvrez notre collection de chaussures intemporelles.',
    continueShopping: 'Continuer les achats',
    orderSummary: 'Résumé de commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    freeShipping: 'Gratuit',
    total: 'Total',
    proceedToCheckout: 'Passer la commande',
    size: 'Taille',
    remove: 'Supprimer',
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
    signInToAccount: 'Connectez-vous à votre compte',
    joinCircle: 'Rejoignez la famille Rym Shoes',
    scroll: 'Défiler',
    timelessShoes: 'Chaussures Intemporelles',
    forModernElegance: "pour l'Élégance Moderne",
    heroSubtitle: 'Chaque paire est une déclaration subtile. Conçue pour ceux qui comprennent que le vrai luxe se murmure.',
  },
};

type Lang = 'ar' | 'fr';

interface LangContextType {
  lang: Lang;
  t: typeof translations.fr;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === 'ar' ? 'fr' : 'ar');
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
