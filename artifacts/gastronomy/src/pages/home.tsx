import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/33142608888";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);

  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuSections = [
    {
      title: "STARTERS",
      img: "/starter.png",
      altLayout: false,
      items: [
        { name: "Foie Gras Terrine", price: "$38", desc: "Served with artisanal brioche and seasonal fruit compote." },
        { name: "Truffle Arancini", price: "$28", desc: "Crispy risotto spheres with molten heart of black truffle." },
        { name: "Oyster & Caviar", price: "$45", desc: "Fresh oysters topped with oscietra caviar and champagne foam." }
      ]
    },
    {
      title: "MAIN COURSE",
      img: "/main-course.png",
      altLayout: true,
      items: [
        { name: "Wagyu Striploin", price: "$98", desc: "A5 grade wagyu beef with gold sauce garnish and micro herbs." },
        { name: "Turbot Fillet", price: "$78", desc: "Pan-seared turbot paired with white asparagus and beurre blanc." },
        { name: "Roasted Duckling", price: "$68", desc: "Spiced honey glazed duckling, root vegetable puree." }
      ]
    },
    {
      title: "DESSERTS",
      img: "/dessert.png",
      altLayout: false,
      items: [
        { name: "Dark Chocolate Sphere", price: "$22", desc: "Valrhona chocolate sphere melted with warm crème anglaise." },
        { name: "Crème Brûlée", price: "$18", desc: "Classic vanilla bean custard with a perfectly caramelized crust." },
        { name: "Mille-feuille", price: "$20", desc: "Delicate puff pastry layers with rich mascarpone cream." }
      ]
    },
    {
      title: "DRINKS",
      img: "/drinks.png",
      altLayout: true,
      items: [
        { name: "Krug Grande Cuvée", price: "$45/glass", desc: "Exquisite champagne with notes of toasted brioche and citrus." },
        { name: "Château Pétrus 2015", price: "$380/glass", desc: "Legendary red wine, profound complexity and elegance." },
        { name: "Negroni Classique", price: "$24", desc: "Gin, vermouth, and campari, perfectly balanced." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled ? "py-4 glass-nav-scrolled" : "py-6 glass-nav"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-serif text-primary tracking-[0.15em] uppercase hover:opacity-80 transition-opacity">
            Maison Laurent
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Home', 'About Us', 'Services', 'Menu'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-sans tracking-widest text-white hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary hover:bg-[#E8CC7A] text-black px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all animate-gold-pulse group"
          >
            <MessageCircle className="w-4 h-4 text-white group-hover:text-black transition-colors" />
            Reserve a Table
          </a>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/30 z-10" />
          <img
            src="/hero.png"
            alt="Chef preparing fine dining"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-primary text-xs md:text-sm tracking-[0.3em] font-medium mb-6">
              ✦ EST. 1987 ✦
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif mb-6 leading-tight max-w-5xl mx-auto gold-gradient-text drop-shadow-lg">
              A Symphony of Flavors
            </h1>
            <p className="text-lg md:text-xl text-white font-light mb-10 max-w-2xl mx-auto tracking-wide">
              Experience culinary excellence, one plate at a time.
            </p>

            <div className="w-24 h-[1px] bg-primary/60 mb-10" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="#menu"
                className="px-8 py-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
              >
                Explore the Menu
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-primary text-black hover:bg-[#E8CC7A] transition-all duration-300 tracking-widest text-sm uppercase animate-gold-pulse"
              >
                Reserve a Table
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary flex flex-col items-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 opacity-70" />
          </motion.div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 bg-background relative z-20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-24 flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-[1px] w-12 md:w-24 bg-primary/50" />
              <h2 className="text-4xl md:text-5xl font-serif text-primary tracking-wide">
                The Perfect Manner
              </h2>
              <div className="h-[1px] w-12 md:w-24 bg-primary/50" />
            </div>
          </motion.div>

          <div className="space-y-32">
            {menuSections.map((section, idx) => (
              <div
                key={section.title}
                className={`flex flex-col ${section.altLayout ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-24`}
              >
                <motion.div
                  className="w-full lg:w-1/2 overflow-hidden rounded-sm"
                  initial={{ opacity: 0, x: section.altLayout ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="relative group aspect-[4/3] overflow-hidden">
                    <img
                      src={section.img}
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </motion.div>

                <motion.div
                  className="w-full lg:w-1/2 flex flex-col justify-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-sm font-sans tracking-[0.3em] text-primary/80 mb-10 uppercase border-b border-primary/20 pb-4 inline-block self-start"
                  >
                    {section.title}
                  </motion.h3>

                  <div className="space-y-10">
                    {section.items.map((item, i) => (
                      <motion.div key={i} variants={fadeInUp} className="flex flex-col">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-2xl font-serif text-primary">{item.name}</h4>
                          <span className="text-white/60 font-sans text-sm tracking-widest pl-4">{item.price}</span>
                        </div>
                        <p className="text-gray-400 font-light text-sm mb-4 leading-relaxed max-w-md">
                          {item.desc}
                        </p>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-medium tracking-widest text-primary hover:text-white transition-colors w-fit group"
                        >
                          <MessageCircle className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                          ORDER VIA WHATSAPP
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="services" className="relative py-0 min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-black/80 to-background z-10" />
          <img
            src="/contact.png"
            alt="Luxury restaurant interior"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <span className="text-primary text-xs tracking-[0.3em] font-medium mb-6 uppercase">
              ✦ Our Concierge ✦
            </span>
            <h2 className="text-5xl md:text-7xl font-serif mb-6 text-white leading-tight">
              Our Host is Waiting <br />
              <span className="text-primary italic">to Assist You.</span>
            </h2>
            <p className="text-lg text-gray-300 font-light mb-12 tracking-wide">
              Open Tuesday–Saturday, 19:00–23:00
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-primary hover:bg-[#E8CC7A] text-black px-10 py-5 rounded-full font-medium text-sm tracking-widest uppercase transition-all animate-gold-pulse group"
            >
              <MessageCircle className="w-5 h-5 text-white group-hover:text-black transition-colors" />
              Start a Chat
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] py-16 border-t border-primary/20 relative z-20">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <Link href="/" className="text-3xl font-serif text-primary tracking-[0.15em] uppercase mb-10">
            Maison Laurent
          </Link>

          <nav className="flex flex-wrap justify-center gap-8 mb-12">
            {['Home', 'About Us', 'Services', 'Menu'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-sans tracking-widest text-gray-400 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex gap-6 mb-12">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          <p className="text-gray-500 text-xs font-sans tracking-widest text-center">
            © 2025 Maison Laurent. All rights reserved. <br className="md:hidden" />
            <span className="hidden md:inline"> · </span> 14 Rue de la Paix, Paris
          </p>
        </div>
      </footer>
    </div>
  );
}
