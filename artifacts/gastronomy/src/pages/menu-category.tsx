import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Instagram, MapPin, Clock, ShoppingBag, Plus, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { t } from "@/lib/translations";
import { useState, useEffect } from "react";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

type DbMenuItem = {
  id: number; nameEn: string; nameFr: string; nameAr: string;
  description: string; price: string; imageUrl?: string;
  category: string; sortOrder: number;
};
type DbCategory = {
  id: number; slug: string; nameEn: string; nameFr: string; nameAr: string; imageUrl?: string;
};

const dishImagePositions = [
  "object-[center_20%]",
  "object-[center_60%]",
  "object-[20%_40%]",
  "object-[80%_40%]",
];

export default function MenuCategory() {
  const { language } = useLanguage();
  const { addItem, totalItems, items: cartItems, isOpen, setIsOpen } = useCart();
  const params = useParams();
  const [, navigate] = useLocation();
  const slug = params.slug as string;

  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [categoryData, setCategoryData] = useState<DbCategory | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/menu/by-category/${slug}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data); })
      .catch(() => {});
    fetch(`/api/categories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((c: DbCategory) => c.slug === slug);
          if (found) setCategoryData(found);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleBack = () => {
    sessionStorage.setItem("scrollTo", "menu");
    navigate("/");
  };

  const handleAddToCart = (item: DbMenuItem) => {
    addItem({
      id: item.id,
      nameEn: item.nameEn,
      nameFr: item.nameFr,
      nameAr: item.nameAr,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    setJustAdded(prev => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
    setTimeout(() => {
      setJustAdded(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1200);
  };

  const categoryName = categoryData
    ? (language === "fr" ? categoryData.nameFr : language === "ar" ? categoryData.nameAr : categoryData.nameEn)
    : t(language, `categories.${slug}`);
  const categoryImage = categoryData?.imageUrl ?? "/hero.png";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 selection:text-primary">

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/8">
        <div className="px-6 md:px-12 py-4 flex items-center gap-4 relative">

          {/* Back button — left */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium">
              {t(language, "return")}
            </span>
          </button>

          {/* Category title — absolutely centred */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none">
            <span className="text-[9px] uppercase tracking-[0.35em] text-primary/60 mb-1">SPART</span>
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-primary/50" />
              <h1 className="text-lg md:text-xl font-serif font-semibold text-white tracking-wide capitalize whitespace-nowrap">
                {categoryName}
              </h1>
              <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          </div>

          {/* Cart button — right */}
          <div className="ml-auto shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-primary/40 rounded-sm text-gray-400 hover:text-white transition-all duration-200 group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="text-[11px] uppercase tracking-widest hidden sm:block">Cart</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="cart-count"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Thin gradient accent under the header */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </header>

      {/* Menu Items */}
      <main className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {items.length === 0 && (
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="col-span-2 text-center text-gray-600 py-20 text-sm uppercase tracking-widest"
            >
              {language === "fr" ? "Aucun plat disponible" : language === "ar" ? "لا توجد أطباق متاحة" : "No items available"}
            </motion.p>
          )}
          {items.map((item, idx) => {
            const itemName = language === "fr" ? item.nameFr
              : language === "ar" ? item.nameAr
              : item.nameEn;
            const itemImg = item.imageUrl || categoryImage;
            const isInCart = cartItems.some(c => c.id === item.id);
            const wasJustAdded = justAdded.has(item.id);
            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="group overflow-hidden rounded-sm
                  bg-white/[0.03] hover:bg-white/[0.055]
                  border border-white/5 hover:border-primary/30
                  transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={itemImg}
                    alt={itemName}
                    className={`w-full h-full object-cover ${dishImagePositions[idx % dishImagePositions.length]}
                      transition-transform duration-700 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/30 to-transparent" />
                  {item.price && (
                    <span className="absolute top-3 right-3 font-serif text-sm font-semibold text-white bg-primary/90 px-3 py-1 rounded-sm backdrop-blur-sm">
                      {item.price}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="font-serif text-xl font-semibold text-white leading-snug group-hover:text-white/95 transition-colors">
                    {itemName}
                  </h3>
                  <div className="h-[1px] bg-gradient-to-r from-primary/40 via-white/10 to-transparent" />
                  <p className="font-sans text-sm font-light text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                      wasJustAdded
                        ? "bg-green-500/15 border border-green-500/40 text-green-400"
                        : isInCart
                        ? "bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25"
                        : "bg-white/[0.04] border border-white/10 text-gray-400 hover:bg-primary/15 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {wasJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : isInCart ? (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add Again
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add to Order
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating cart bar — shown when cart has items */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
            >
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 bg-primary text-black font-bold text-sm px-6 py-3.5 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-primary/90 transition-colors"
              >
                <span className="bg-black/20 rounded-sm px-2 py-0.5 text-xs font-bold">{totalItems}</span>
                <span className="uppercase tracking-widest">View Order</span>
                <ShoppingBag className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-white/5">

        {/* Gradient top edge */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-6 md:px-12 pt-16 pb-10">

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

            {/* Column 1 — Brand */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <img src="/spart-logo.jpg" alt="Spart" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-xl font-serif font-bold tracking-widest text-white">SPART</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Born in the heart of Bordj Bou Arreridj — a celebration of bold flavors, timeless craft, and Algerian warmth.
              </p>
              <a
                href="https://www.instagram.com/spartepizza?igsh=MWNkOXZocWdjaWpodA=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-gray-500 hover:text-primary transition-colors group w-fit"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                @spartepizza
              </a>
            </div>

            {/* Column 2 — Navigation */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-medium">
                Explore
              </h4>
              <nav className="flex flex-col gap-3">
                {[
                  { href: "/#menu", label: t(language, "nav.menu") },
                  { href: "/#experience", label: t(language, "nav.experience") },
                  { href: "/#about", label: t(language, "nav.about") },
                  { href: "/#contact", label: t(language, "nav.contact") },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-4 h-[1px] bg-primary/40 group-hover:w-6 transition-all duration-300" />
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Column 3 — Contact */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-medium">
                Find Us
              </h4>
              <div className="flex flex-col gap-4 text-sm text-gray-500">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">Station Mounia, Bd Remache Aissa,<br />Bordj Bou Arreridj 34000, Algeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-primary/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:0791943137" className="hover:text-white transition-colors">0791 943 137</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary/50 shrink-0" />
                  <span>Open daily · 11:00 – 23:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-gray-700">
            <span>© {new Date().getFullYear()} Spart Restaurant. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
