import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CheckCircle, Phone, User } from "lucide-react";
import { useCart, parsePrice } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formatDA = (n: number) => `${n.toLocaleString("fr-DZ")} DA`;

type Step = "cart" | "form" | "success";

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, isOpen, setIsOpen, clearCart } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [successPhone, setSuccessPhone] = useState("");

  const getName = (item: { nameEn: string; nameFr: string; nameAr: string }) =>
    language === "fr" ? item.nameFr : language === "ar" ? item.nameAr : item.nameEn;

  const handleClose = () => {
    setIsOpen(false);
    // Reset to cart view after drawer closes
    setTimeout(() => {
      if (step !== "success") setStep("cart");
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (!phone.trim()) {
      toast({ title: "Phone required", description: "Please enter your phone number.", variant: "destructive" });
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: "n/a",
          customerPhone: phone.trim(),
          message: note.trim() || undefined,
          items: items.map(i => ({
            id: i.id,
            nameEn: i.nameEn,
            nameFr: i.nameFr,
            nameAr: i.nameAr,
            price: i.price,
            quantity: i.quantity,
          })),
          totalPrice: totalPrice > 0 ? formatDA(totalPrice) : undefined,
        }),
      });
      if (!res.ok) throw new Error();

      setSuccessName(name.trim());
      setSuccessPhone(phone.trim());
      setStep("success");
      clearCart();

      // Auto-close after 4s
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setStep("cart");
          setName("");
          setPhone("");
          setNote("");
        }, 400);
      }, 4000);
    } catch {
      toast({ title: "Error", description: "Could not place your order. Please try again.", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-white/8 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ── STEP: SUCCESS ── */}
            {step === "success" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 gap-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.1, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="text-2xl font-serif text-white mb-3">Order Received!</h2>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    Thank you, <span className="text-white font-medium">{successName}</span>. We received your order and will call you at{" "}
                    <span className="text-primary font-medium">{successPhone}</span> shortly.
                  </p>
                </motion.div>
                <div className="w-full h-px bg-white/5 mt-2" />
                <p className="text-xs text-gray-700 uppercase tracking-[0.25em]">SPART · Bordj Bou Arreridj</p>
              </div>
            )}

            {/* ── STEP: CHECKOUT FORM ── */}
            {step === "form" && (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 shrink-0">
                  <button
                    onClick={() => setStep("cart")}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-base font-serif text-white flex-1">Your Details</h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                    {/* Order summary (compact) */}
                    <div className="bg-white/[0.025] border border-white/6 rounded-sm p-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-3">Order Summary</p>
                      {items.map(item => {
                        const it = parsePrice(item.price) * item.quantity;
                        return (
                          <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                            <span className="text-gray-300 truncate">
                              {getName(item)}
                              <span className="text-gray-600 ml-2">× {item.quantity}</span>
                            </span>
                            <span className="text-primary shrink-0">
                              {it > 0 ? formatDA(it) : item.price}
                            </span>
                          </div>
                        );
                      })}
                      {totalPrice > 0 && (
                        <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-gray-600 uppercase tracking-widest">Total</span>
                          <span className="font-serif text-primary font-semibold">{formatDA(totalPrice)}</span>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Name */}
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5 flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        autoFocus
                        className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm h-11"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 0791 943 137"
                        type="tel"
                        autoComplete="tel"
                        className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm h-11"
                      />
                    </div>

                    {/* Note */}
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                        Notes <span className="text-gray-700">(optional)</span>
                      </label>
                      <Textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Allergies, preferences, special requests..."
                        rows={3}
                        className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm resize-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit footer */}
                  <div className="px-5 py-4 border-t border-white/8 bg-[#0a0a0a] shrink-0">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-black font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm transition-colors"
                    >
                      {submitting ? "Placing Order..." : "Confirm Order"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ── STEP: CART ITEMS ── */}
            {step === "cart" && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-serif text-white">Your Order</h2>
                    {totalItems > 0 && (
                      <span className="text-xs bg-primary text-black font-bold px-2 py-0.5 rounded-full leading-5">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 py-20">
                      <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm uppercase tracking-widest mb-2">Your cart is empty</p>
                      <p className="text-xs text-gray-700">Browse the menu and add dishes you love</p>
                    </div>
                  ) : (
                    items.map(item => {
                      const itemTotal = parsePrice(item.price) * item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-sm p-3 hover:bg-white/[0.05] transition-colors"
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={getName(item)}
                              className="w-14 h-14 object-cover rounded-sm shrink-0 border border-white/5"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-white/5 rounded-sm shrink-0 border border-white/5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{getName(item)}</p>
                            <p className="text-xs text-primary mt-0.5">{item.price}</p>
                            {itemTotal > 0 && (
                              <p className="text-xs text-gray-600 mt-0.5">= {formatDA(itemTotal)}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm text-white w-5 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-500/60 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer with total + CTA */}
                {items.length > 0 && (
                  <div className="px-5 py-4 border-t border-white/8 space-y-3 bg-[#0a0a0a] shrink-0">
                    {/* Line items */}
                    <div className="space-y-1.5">
                      {items.map(item => {
                        const it = parsePrice(item.price) * item.quantity;
                        if (it === 0) return null;
                        return (
                          <div key={item.id} className="flex items-center justify-between text-xs text-gray-600">
                            <span>{getName(item)} × {item.quantity}</span>
                            <span>{formatDA(it)}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 uppercase tracking-widest font-light">Total</span>
                      <span className="font-serif text-2xl text-primary font-semibold">
                        {totalPrice > 0 ? formatDA(totalPrice) : "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => setStep("form")}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
