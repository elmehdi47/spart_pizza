export const translations = {
  en: {
    navBack: "← Back to Menu",
    ourMenu: "Our Menu",
    explore: "Explore →",
    orderViaWhatsapp: "Order via WhatsApp",
    categories: {
      starters: "Starters",
      mains: "Signature Mains",
      desserts: "Desserts",
      drinks: "Drinks"
    }
  },
  fr: {
    navBack: "← Retour au Menu",
    ourMenu: "Notre Menu",
    explore: "Explorer →",
    orderViaWhatsapp: "Commander via WhatsApp",
    categories: {
      starters: "Entrées",
      mains: "Plats Signatures",
      desserts: "Desserts",
      drinks: "Boissons"
    }
  },
  ar: {
    navBack: "← العودة للقائمة",
    ourMenu: "قائمتنا",
    explore: "استكشف ←",
    orderViaWhatsapp: "اطلب عبر واتساب",
    categories: {
      starters: "مقبلات",
      mains: "الأطباق الرئيسية",
      desserts: "حلويات",
      drinks: "المشروبات"
    }
  }
};

export const t = (lang: "en" | "fr" | "ar", key: string): string => {
  const keys = key.split('.');
  let current: any = translations[lang];
  for (const k of keys) {
    if (current[k] === undefined) return key;
    current = current[k];
  }
  return current;
};
