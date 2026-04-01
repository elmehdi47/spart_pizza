import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { menuCategories } from "@/lib/menuData";

export default function Menu() {
  const { language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const tileVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-primary/30 selection:text-primary">
      <header className="sticky top-0 z-50 py-6 px-6 md:px-12 flex items-center justify-between glass-panel border-b border-white/5">
        <Link href="/" className="text-2xl font-serif font-bold tracking-widest hover:text-primary transition-colors">
          AURUM
        </Link>
        <div className="text-lg font-serif tracking-wide text-primary">
          {t(language, "ourMenu")}
        </div>
        <div className="flex gap-2 text-sm tracking-widest font-medium">
          <button 
            onClick={() => setLanguage("en")} 
            className={`transition-colors ${language === "en" ? "text-primary" : "text-gray-500 hover:text-white"}`}
          >
            EN
          </button>
          <span className="text-gray-700">|</span>
          <button 
            onClick={() => setLanguage("fr")} 
            className={`transition-colors ${language === "fr" ? "text-primary" : "text-gray-500 hover:text-white"}`}
          >
            FR
          </button>
          <span className="text-gray-700">|</span>
          <button 
            onClick={() => setLanguage("ar")} 
            className={`transition-colors ${language === "ar" ? "text-primary" : "text-gray-500 hover:text-white"}`}
          >
            AR
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-140px)] min-h-[600px]"
          >
            {menuCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={tileVariant}
                onClick={() => setLocation(`/menu/${category.slug}`)}
                className="group relative overflow-hidden rounded-sm cursor-pointer border border-transparent hover:border-primary/50 transition-colors duration-500"
              >
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={t(language, `categories.${category.id}`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4 drop-shadow-md">
                    {t(language, `categories.${category.id}`)}
                  </h2>
                  <span className="text-sm uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {t(language, "explore")}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
