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
  const { language, setLanguage } = useLanguage();
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
      <header className="sticky top-0 z-50 py-5 px-6 md:px-12 flex items-center justify-between glass-panel border-b border-white/5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-medium border border-white/15 text-gray-300 hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t(language, "navBack").replace("← ", "").replace(" ←", "")}
          </button>

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
    </div>
  );
}
