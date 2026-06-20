import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import NewProductPage from "@/pages/admin/NewProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider, useLang } from "@/context/LanguageContext";
import VideoLoader from "@/components/VideoLoader";

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLang();
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={() => <StorefrontLayout><HomePage /></StorefrontLayout>} />
      <Route path="/shop" component={() => <StorefrontLayout><ShopPage /></StorefrontLayout>} />
      <Route path="/product/:id" component={() => <StorefrontLayout><ProductPage /></StorefrontLayout>} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={() => <StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
      <Route path="/login" component={() => <StorefrontLayout><LoginPage /></StorefrontLayout>} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/products/new" component={NewProductPage} />
      <Route path="/admin/products/:id/edit" component={EditProductPage} />
    </Switch>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(() => sessionStorage.getItem("rym_intro_done") === "1");

  function handleDone() {
    sessionStorage.setItem("rym_intro_done", "1");
    setLoaded(true);
  }

  return (
    <LanguageProvider>
      <CartProvider>
        {!loaded && <VideoLoader onDone={handleDone} />}
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
      </CartProvider>
    </LanguageProvider>
  );
}
