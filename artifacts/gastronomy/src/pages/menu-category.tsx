import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { menuItems } from "@/lib/menuData";

export default function MenuCategory() {
  const { language, setLanguage } = useLanguage();
  const params = useParams();
  const slug = params.slug as keyof typeof menuItems;

  const items = menuItems[slug] || [];
  const categoryName = t(language, `categories.${slug}`);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 selection:text-primary">

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 py-5 px-6 md:px-12 flex items-center justify-between glass-panel border-b border-white/5">
        <Link href="/#menu">
          <button className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-medium border border-white/15 text-gray-300 hover:border-primary/50 hover:text-primary transition-all duration-300">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t(language, "navBack").replace("← ", "").replace(" ←", "")}
          </button>
        </Link>

        <div className="text-xl md:text-2xl font-serif tracking-wide text-primary capitalize">
          {categoryName}
        </div>

        <div className="flex items-center gap-2 text-sm tracking-widest font-medium">
          {(["en", "fr", "ar"] as const).map((lang, i, arr) => (
            <span key={lang} className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(lang)}
                className={`transition-colors uppercase ${language === lang ? "text-primary" : "text-gray-500 hover:text-white"}`}
              >
                {lang}
              </button>
              {i < arr.length - 1 && <span className="text-gray-700">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Menu Items */}
      <main className="container mx-auto px-6 py-16 md:py-24 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="group relative flex flex-col gap-4 p-7 rounded-sm
                bg-white/[0.03] hover:bg-white/[0.06]
                border-l-2 border-l-primary/40 border-t border-t-white/5 border-r border-r-white/5 border-b border-b-white/5
                hover:border-l-primary
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Name & Price Row */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-xl font-semibold text-white leading-tight group-hover:text-white/95 transition-colors">
                  {item.names[language]}
                </h3>
                <span className="font-serif text-lg font-medium text-primary shrink-0 mt-0.5">
                  {item.price}
                </span>
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-gradient-to-r from-primary/30 via-white/10 to-transparent" />

              {/* Description */}
              <p className="font-sans text-sm font-light text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
