import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ShoppingBag } from "lucide-react";
import { useCart, parsePrice } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getName = (item: { nameEn: string; nameFr: string; nameAr: string }) =>
    language === "fr" ? item.nameFr : language === "ar" ? item.nameAr : item.nameEn;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const formatDA = (n: number) => `${n.toLocaleString("fr-DZ")} DA`;

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
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add at least one item to your order.", variant: "destructive" });
      return;
    }

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
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName("");
        setPhone("");
        setNote("");
      }, 4000);
    } catch {
      toast({ title: "Error", description: "Could not place your order. Please try again.", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="checkout-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            key="checkout-modal"
            initial={{ scale: 0.95, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="bg-[#0d0d0d] border border-white/10 rounded-sm w-full max-w-lg shadow-2xl"
          >
            {success ? (
              <div className="p-12 flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-white mb-3">Order Received!</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    Thank you, <span className="text-white font-medium">{name}</span>. We received your order and will call you at{" "}
                    <span className="text-primary font-medium">{phone}</span> shortly.
                  </p>
                </div>
                <div className="w-full h-px bg-white/5 my-1" />
                <p className="text-xs text-gray-600 uppercase tracking-widest">SPART — Bordj Bou Arreridj</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-serif text-white">Complete Your Order</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Order summary */}
                  <div className="bg-white/[0.025] border border-white/5 rounded-sm p-4 space-y-2 max-h-40 overflow-y-auto">
                    {items.map(item => {
                      const it = parsePrice(item.price) * item.quantity;
                      return (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 truncate max-w-[60%]">
                            {getName(item)}
                            <span className="text-gray-600 ml-2">× {item.quantity}</span>
                          </span>
                          <span className="text-primary shrink-0 ml-2">
                            {it > 0 ? formatDA(it) : item.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Contact fields */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <Input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 0791 943 137"
                      type="tel"
                      autoComplete="tel"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">
                      Notes <span className="text-gray-700">(optional)</span>
                    </label>
                    <Textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Allergies, preferences, special requests..."
                      rows={2}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 rounded-sm resize-none text-sm"
                    />
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">Total</p>
                      <p className="font-serif text-2xl text-primary font-semibold">
                        {totalPrice > 0 ? formatDA(totalPrice) : "—"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm transition-colors h-auto"
                  >
                    {submitting ? "Placing Order..." : "Confirm Order"}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
