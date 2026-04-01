import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, ChevronRight, MapPin, Instagram, Twitter, Facebook, GlassWater, ChefHat, Utensils, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { menuCategories } from "@/lib/menuData";

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
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

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
          navScrolled ? "py-4 glass-panel border-b border-white/5" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-white hover:text-primary transition-colors">
            AURUM
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Menu', 'Experience', 'About'].map((item) => (
              item === 'Menu' ? (
                <Link
                  key={item}
                  href="/menu"
                  className="text-sm tracking-widest uppercase text-gray-300 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ) : (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-sm tracking-widest uppercase text-gray-300 hover:text-primary transition-colors"
                >
                  {item}
                </a>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm tracking-widest font-medium">
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
            <a href="#contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 font-medium tracking-wide uppercase text-xs gold-glow">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </header>

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
              A curated journey of flavors, reserved just for you. 
              Only 28 seats per evening.
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
          <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
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
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our <span className="italic text-gray-400">Menu</span></h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto font-light">Each dish is a masterpiece, crafted with precision, seasonal ingredients, and bound by culinary tradition.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {menuCategories.map((category, i) => (
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
                    src={category.image}
                    alt={t(language, `categories.${category.id}`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="text-3xl md:text-4xl font-serif text-primary mb-3 drop-shadow-md">
                    {t(language, `categories.${category.id}`)}
                  </h3>
                  <span className="text-xs uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
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
              <h2 className="text-4xl md:text-5xl font-serif mb-6">The <span className="italic text-gray-400">Experience</span></h2>
              <p className="text-gray-400 font-light leading-relaxed">Beyond the dining room, Aurum offers tailored experiences for those seeking deeper immersion into the culinary arts.</p>
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
              { icon: Users, title: "Private Dining", desc: "An exclusive room for up to 12 guests, featuring a dedicated sommelier and a customized tasting menu." },
              { icon: ChefHat, title: "Chef's Table", desc: "Sit front row to the kitchen action. Interact with Chef Laurent as he prepares an unscripted menu." },
              { icon: GlassWater, title: "Sommelier Selection", desc: "A curated journey through our 2,000-bottle cellar, pairing rare vintages with our signature courses." }
            ].map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group p-8 border border-white/5 hover:border-primary/30 transition-colors duration-500 bg-background/50 hover:bg-zinc-900/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <exp.icon className="w-10 h-10 text-primary mb-6 stroke-[1px]" />
                <h3 className="text-2xl font-serif mb-4 text-white">{exp.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm mb-8">{exp.desc}</p>
                <button className="flex items-center text-xs uppercase tracking-widest text-primary font-medium hover:text-white transition-colors">
                  Discover More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
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
                Chef <span className="italic text-gray-400">Marco Laurent</span>
              </h2>
              <div className="space-y-6 text-gray-400 font-light leading-relaxed mb-12">
                <p>
                  "Cooking is not just about combining ingredients. It is about capturing a moment in time, an emotion, a memory, and presenting it on a plate."
                </p>
                <p>
                  Trained in the finest kitchens across Paris, Tokyo, and San Sebastián, Chef Laurent brings a worldly perspective to classic French techniques. At Aurum, every detail is orchestrated to challenge expectations and delight the senses.
                </p>
              </div>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest text-xs px-8 py-6">
                Read Our Story
              </Button>
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
              <h2 className="text-3xl font-serif mb-2 text-white">Contact Us</h2>
              <p className="text-sm text-gray-400 mb-10 font-light">Request a reservation or inquire about private events.</p>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Name</label>
                  <Input className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                  <Input type="email" className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Date</label>
                    <Input type="date" className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white color-scheme-dark" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Guests</label>
                    <select className="w-full bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-2 focus:ring-0 focus:border-primary text-white text-sm outline-none appearance-none cursor-pointer">
                      <option className="bg-zinc-900 text-white" value="1">1 Person</option>
                      <option className="bg-zinc-900 text-white" value="2">2 People</option>
                      <option className="bg-zinc-900 text-white" value="3">3 People</option>
                      <option className="bg-zinc-900 text-white" value="4">4 People</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Special Requests</label>
                  <Textarea className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white resize-none min-h-[80px]" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none py-6 font-medium tracking-widest uppercase text-xs mt-4 gold-glow">
                  Submit Request
                </Button>
              </form>
            </motion.div>
          </div>
          
          {/* Info Side */}
          <div className="w-full lg:w-1/2 relative bg-zinc-900 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none grayscale">
               {/* Decorative background or iframe */}
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.4754592471676!2d2.329241515674712!3d48.86821217928833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e31bd6e4aeb%3A0xc34a0210f135b546!2s14%20Rue%20de%20la%20Paix%2C%2075002%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(100%) contrast(120%) brightness(50%)" }} 
                allowFullScreen={false} 
                loading="lazy"
              ></iframe>
            </div>
            
            <div className="relative z-10 p-8 lg:p-24 flex flex-col h-full bg-black/60 backdrop-blur-[2px]">
              <div className="mt-auto">
                <h3 className="text-2xl font-serif text-white mb-8">Aurum</h3>
                <ul className="space-y-6 text-gray-300 font-light text-sm">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-4 mt-0.5 shrink-0" />
                    <span>14 Rue de la Paix<br/>75002 Paris, France</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 text-primary mr-4 mt-0.5 shrink-0" />
                    <span>Tuesday – Saturday<br/>19:00 – 23:00</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center mr-4 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span>Reservations: +33 1 42 60 88 88<br/>reservations@aurum-paris.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="text-3xl font-serif font-bold tracking-widest text-white mb-8">
            AURUM
          </div>
          <div className="flex gap-6 mb-12">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-600 flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <span>© {new Date().getFullYear()} Aurum Restaurant.</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
