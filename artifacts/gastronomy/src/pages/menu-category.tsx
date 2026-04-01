import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { menuItems } from "@/lib/menuData";

export default function MenuCategory() {
  const { language, setLanguage } = useLanguage();
  const params = useParams();
  const slug = params.slug as keyof typeof menuItems;

  const items = menuItems[slug] || [];
  const categoryName = t(language, `categories.${slug}`);

  const handleWhatsapp = (dishName: string) => {
    const text = encodeURIComponent(`I would like to order the ${dishName}`);
    window.open(`https://wa.me/33142608888?text=${text}`, "_blank");
  };

  const isRtl = language === "ar";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 selection:text-primary">
      <header className="sticky top-0 z-50 py-5 px-6 md:px-12 flex items-center justify-between glass-panel border-b border-white/5">
        <Link href="/menu">
          <button className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-medium border border-white/15 text-gray-300 hover:border-primary/50 hover:text-primary transition-all duration-300">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t(language, "navBack").replace("← ", "")}
          </button>
        </Link>
        <div className="text-xl md:text-2xl font-serif tracking-wide text-primary capitalize">
          {categoryName}
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

      <main className="container mx-auto px-6 py-12 md:py-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className={`
                relative overflow-hidden rounded-[4px] p-7 
                bg-white/[0.04] backdrop-blur-[16px] 
                border border-[#D4AF37]/25 
                hover:-translate-y-[2px] hover:border-[#D4AF37]/60 
                transition-all duration-300
                flex flex-col sm:flex-row gap-6 justify-between
                ${isRtl ? 'sm:flex-row-reverse text-right' : 'text-left'}
              `}
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className={`flex items-start justify-between gap-4 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {item.names[language]}
                  </h3>
                  <span className="font-serif text-lg font-medium text-primary shrink-0">
                    {item.price}
                  </span>
                </div>
                <p className="font-sans font-light text-sm text-gray-300 leading-relaxed max-w-[90%]">
                  {item.description}
                </p>
              </div>

              <div className="sm:w-auto flex items-center shrink-0">
                <button
                  onClick={() => handleWhatsapp(item.names.en)}
                  className={`
                    flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3
                    rounded-[4px] text-xs uppercase tracking-widest font-medium
                    border border-green-500/30 text-green-400 bg-green-500/5
                    hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-300
                    transition-colors
                    ${isRtl ? 'flex-row-reverse' : ''}
                  `}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t(language, "orderViaWhatsapp")}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
