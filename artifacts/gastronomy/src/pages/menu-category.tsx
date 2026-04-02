import { motion } from "framer-motion";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { menuItems, menuCategories } from "@/lib/menuData";

const dishImagePositions = [
  "object-[center_20%]",
  "object-[center_60%]",
  "object-[20%_40%]",
  "object-[80%_40%]",
];

export default function MenuCategory() {
  const { language } = useLanguage();
  const params = useParams();
  const [, navigate] = useLocation();
  const slug = params.slug as keyof typeof menuItems;

  const handleBack = () => {
    sessionStorage.setItem("scrollTo", "menu");
    navigate("/");
  };

  const items = menuItems[slug] || [];
  const categoryName = t(language, `categories.${slug}`);
  const categoryData = menuCategories.find((c) => c.slug === slug);
  const categoryImage = categoryData?.image ?? "/hero.png";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 selection:text-primary">

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/8">
        <div className="px-6 md:px-12 py-4 flex items-center gap-4 relative">

          {/* Back button — left */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium">
              {t(language, "navBack").replace("← ", "").replace(" ←", "")}
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
          {items.map((item, idx) => (
            <motion.div
              key={idx}
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
                  src={categoryImage}
                  alt={item.names.en}
                  className={`w-full h-full object-cover ${dishImagePositions[idx % dishImagePositions.length]}
                    transition-transform duration-700 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/30 to-transparent" />
                {/* Price badge floating on image */}
                <span className="absolute top-3 right-3 font-serif text-sm font-semibold text-white bg-primary/90 px-3 py-1 rounded-sm backdrop-blur-sm">
                  {item.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-3">
                <h3 className="font-serif text-xl font-semibold text-white leading-snug group-hover:text-white/95 transition-colors">
                  {item.names[language]}
                </h3>
                <div className="h-[1px] bg-gradient-to-r from-primary/40 via-white/10 to-transparent" />
                <p className="font-sans text-sm font-light text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/60 mt-8">
        <div className="container mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/spart-logo.jpg" alt="Spart" className="h-8 w-8 rounded-full object-cover opacity-80" />
            <div>
              <p className="text-sm font-serif font-semibold tracking-widest text-white/80">SPART</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-600">Bordj Bou Arreridj</p>
            </div>
          </div>

          {/* Back to menu CTA */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            {t(language, "navBack").replace("← ", "").replace(" ←", "")}
          </button>

          {/* Copyright */}
          <p className="text-[10px] uppercase tracking-widest text-gray-700">
            © {new Date().getFullYear()} Spart Restaurant
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      </footer>
    </div>
  );
}
