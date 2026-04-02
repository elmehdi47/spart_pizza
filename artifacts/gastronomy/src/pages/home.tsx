import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, Users, ChevronRight, MapPin, Instagram, GlassWater, ChefHat, Utensils, Star, Navigation, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiCategories, setApiCategories] = useState<Array<{
    id: number; slug: string; nameEn: string; nameFr: string; nameAr: string; imageUrl?: string; sortOrder: number;
  }>>([]);

  const closeMobile = () => setMobileMenuOpen(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiCategories(data); })
      .catch(() => {});
  }, []);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      toast({ title: "Required fields", description: "Please enter your name, email, and phone number.", variant: "destructive" });
      return;
    }
    setFormSubmitting(true);
    try {
      const r = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formName,
          customerEmail: formEmail,
          customerPhone: formPhone || undefined,
          message: formMessage || undefined,
        }),
      });
      if (!r.ok) throw new Error();
      setFormSuccess(true);
      setFormName(""); setFormEmail(""); setFormPhone(""); setFormMessage("");
      toast({ title: "Request sent", description: "We will be in touch with you shortly." });
      setTimeout(() => setFormSuccess(false), 5000);
    } catch {
      toast({ title: "Error", description: "Could not send your request. Please try again.", variant: "destructive" });
    }
    setFormSubmitting(false);
  };
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const scrollTo = sessionStorage.getItem("scrollTo");
    if (scrollTo) {
      sessionStorage.removeItem("scrollTo");
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      setTimeout(() => tryScroll(), 150);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled ? "py-4 bg-black/90 backdrop-blur-md border-b border-white/5" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            onClick={() => {
              closeMobile();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src="/spart-logo.jpg" alt="Spart" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xl font-serif font-bold tracking-widest text-white">SPART</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-sm tracking-widest uppercase text-gray-300 hover:text-primary transition-colors">{t(language, "nav.menu")}</a>
            <a href="#experience" className="text-sm tracking-widest uppercase text-gray-300 hover:text-primary transition-colors">{t(language, "nav.experience")}</a>
            <a href="#about" className="text-sm tracking-widest uppercase text-gray-300 hover:text-primary transition-colors">{t(language, "nav.about")}</a>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm tracking-widest font-medium">
              <button onClick={() => setLanguage("en")} className={`transition-colors ${language === "en" ? "text-primary" : "text-gray-500 hover:text-white"}`}>EN</button>
              <span className="text-gray-700">|</span>
              <button onClick={() => setLanguage("fr")} className={`transition-colors ${language === "fr" ? "text-primary" : "text-gray-500 hover:text-white"}`}>FR</button>
              <span className="text-gray-700">|</span>
              <button onClick={() => setLanguage("ar")} className={`transition-colors ${language === "ar" ? "text-primary" : "text-gray-500 hover:text-white"}`}>AR</button>
            </div>
            <a href="#contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 font-medium tracking-wide uppercase text-xs gold-glow">
                {t(language, "nav.contact")}
              </Button>
            </a>
            <Link href={isAuthenticated ? "/admin" : "/login"}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-medium text-gray-500 hover:text-primary border border-white/8 hover:border-primary/30 rounded-sm transition-all duration-200">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {isAuthenticated ? "Admin" : "Login"}
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay menu — outside header to avoid clipping */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{ backgroundColor: "rgba(0,0,0,0.97)" }}
        >
          {/* Top bar matching the header height */}
          <div className="h-[72px] shrink-0" />

          {/* Menu content */}
          <div className="flex-1 flex flex-col px-8 pt-4 pb-10">
            <nav className="flex flex-col border-t border-white/10">
              {[
                { href: "#menu", label: t(language, "nav.menu") },
                { href: "#experience", label: t(language, "nav.experience") },
                { href: "#about", label: t(language, "nav.about") },
                { href: "#contact", label: t(language, "nav.contact") },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="py-5 text-lg font-serif text-gray-200 border-b border-white/5 hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm tracking-widest font-medium">
                <button onClick={() => { setLanguage("en"); closeMobile(); }} className={`uppercase ${language === "en" ? "text-primary" : "text-gray-500"}`}>EN</button>
                <span className="text-gray-700">|</span>
                <button onClick={() => { setLanguage("fr"); closeMobile(); }} className={`uppercase ${language === "fr" ? "text-primary" : "text-gray-500"}`}>FR</button>
                <span className="text-gray-700">|</span>
                <button onClick={() => { setLanguage("ar"); closeMobile(); }} className={`uppercase ${language === "ar" ? "text-primary" : "text-gray-500"}`}>AR</button>
              </div>
              <Link href={isAuthenticated ? "/admin" : "/login"} onClick={closeMobile}>
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest text-gray-400 border border-white/15 rounded-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  {isAuthenticated ? "Admin" : "Login"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
          <img 
            src="/hero.png" 
            alt="Aurum Signature Scallop" 
            className="w-full h-full object-cover scale-105"
          />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 pt-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <Star className="w-4 h-4 text-primary fill-primary" />
              <Star className="w-4 h-4 text-primary fill-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight max-w-4xl mx-auto text-white">
              Taste the <span className="gold-text-gradient italic">Extraordinary.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto tracking-wide">
              {t(language, "hero.sub")}
            </p>
          </motion.div>

        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-widest text-gray-500">Welcome</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>

      {/* Our Menu */}
      <section id="menu" className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{t(language, "sections.menuTitle")} <span className="italic text-gray-400">{t(language, "sections.menuTitleItalic")}</span></h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto font-light">{t(language, "sections.menuSub")}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {apiCategories.map((category, i) => {
              const catName = language === "fr" ? category.nameFr
                : language === "ar" ? category.nameAr
                : category.nameEn;
              const imgSrc = category.imageUrl || "/hero.png";
              return (
                <motion.div
                  key={category.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }
                  }}
                  onClick={() => setLocation(`/menu/${category.slug}`)}
                  className="group relative overflow-hidden cursor-pointer border border-transparent hover:border-primary/50 transition-colors duration-500"
                  style={{ aspectRatio: "16/9" }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={imgSrc}
                      alt={catName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-3xl md:text-4xl font-serif text-primary mb-3 drop-shadow-md">
                      {catName}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      Explore →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experience" className="py-32 bg-zinc-950 relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">{t(language, "sections.experienceTitle")}{" "}<span className="italic text-gray-400">{t(language, "sections.experienceTitleItalic")}</span></h2>
              <p className="text-gray-400 font-light leading-relaxed">{t(language, "sections.experienceSub")}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Star, titleKey: "experiences.privateDiningTitle", descKey: "experiences.privateDiningDesc" },
              { icon: ChefHat, titleKey: "experiences.chefsTableTitle", descKey: "experiences.chefsTableDesc" },
              { icon: Users, titleKey: "experiences.sommelierTitle", descKey: "experiences.sommelierDesc" }
            ].map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group p-8 border border-white/5 hover:border-primary/30 transition-colors duration-500 bg-background/50 hover:bg-zinc-900/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <exp.icon className="w-10 h-10 text-primary mb-6 stroke-[1px]" />
                <h3 className="text-2xl font-serif mb-4 text-white">{t(language, exp.titleKey)}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm">{t(language, exp.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Split */}
      <section id="about" className="py-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
            <img 
              src="/chef.png" 
              alt="Chef Marco Laurent" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent lg:from-transparent lg:bg-black/20" />
          </div>
          <div className="w-full lg:w-1/2 flex items-center bg-zinc-900">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="p-12 lg:p-24 max-w-2xl"
            >
              <div className="w-12 h-[1px] bg-primary mb-8" />
              <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">
                {t(language, "sections.aboutTitle")} <span className="italic text-gray-400">{t(language, "sections.aboutTitleItalic")}</span>
              </h2>
              <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                <p>{t(language, "sections.aboutQuote")}</p>
                <p>{t(language, "sections.aboutBody")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Contact Us */}
      <section id="contact" className="py-0 border-t border-white/5 relative">
        <div className="flex flex-col lg:flex-row min-h-[80vh]">
          {/* Form Side */}
          <div className="w-full lg:w-1/2 p-8 lg:p-24 bg-zinc-950 flex flex-col justify-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-md w-full mx-auto lg:mx-0"
            >
              <h2 className="text-3xl font-serif mb-2 text-white">{t(language, "sections.contactTitle")}</h2>
              <p className="text-sm text-gray-400 mb-10 font-light">{t(language, "sections.contactSub")}</p>
              
              {formSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-xl">✓</span>
                  </div>
                  <p className="text-white font-serif text-lg mb-2">Request received</p>
                  <p className="text-gray-400 text-sm font-light">We will be in touch with you shortly.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">{t(language, "form.name")}</label>
                    <Input value={formName} onChange={e => setFormName(e.target.value)} required className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">{t(language, "form.email")}</label>
                    <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">{t(language, "form.phone")} <span className="text-primary">*</span></label>
                    <Input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} required className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">{t(language, "form.requests")}</label>
                    <Textarea value={formMessage} onChange={e => setFormMessage(e.target.value)} className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white resize-none min-h-[80px]" />
                  </div>
                  <Button disabled={formSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none py-6 font-medium tracking-widest uppercase text-xs mt-4 gold-glow">
                    {formSubmitting ? "Sending..." : t(language, "sections.submitRequest")}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
          
          {/* Info Side */}
          <div className="w-full lg:w-1/2 relative bg-zinc-900 flex flex-col justify-between">
            <div className="absolute inset-0 pointer-events-none">
               <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.750%2C36.060%2C4.785%2C36.085&layer=mapnik&marker=36.072%2C4.763" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(85%) hue-rotate(180deg) saturate(0.25) brightness(0.45)" }} 
                allowFullScreen={false} 
                loading="lazy"
                title="Spart Location"
              ></iframe>
            </div>
            
            <div className="relative z-10 p-8 lg:p-24 flex flex-col h-full bg-black/65 backdrop-blur-[2px]">
              <div className="mt-auto">
                <h3 className="text-2xl font-serif text-white mb-8">Spart</h3>
                <ul className="space-y-6 text-gray-300 font-light text-sm mb-8">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-4 mt-0.5 shrink-0" />
                    <a href="https://maps.app.goo.gl/xbVaWq3dKPK9g5sHA" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      station Mounia, Bd Remache Aissa<br/>Bordj Bou Arreridj 34000
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center mr-4 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <a href="tel:0791943137" className="hover:text-primary transition-colors">0791943137</a>
                  </li>
                </ul>

                {/* Google Maps CTA */}
                <a
                  href="https://maps.app.goo.gl/xbVaWq3dKPK9g5sHA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-white/10 hover:border-primary/50 bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <Navigation className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white font-medium mb-0.5">Open in Google Maps</p>
                    <p className="text-xs text-gray-500 font-light">Get directions to SPART</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  { href: "#menu", label: t(language, "nav.menu") },
                  { href: "#experience", label: t(language, "nav.experience") },
                  { href: "#about", label: t(language, "nav.about") },
                  { href: "#contact", label: t(language, "nav.contact") },
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

    </div>
  );
}
