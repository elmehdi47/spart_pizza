import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, parsePrice } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  onCheckout: () => void;
};

const formatDA = (n: number) => `${n.toLocaleString("fr-DZ")} DA`;

export default function CartDrawer({ onCheckout }: Props) {
  const { items, removeItem, updateQty, totalItems, totalPrice, isOpen, setIsOpen } = useCart();
  const { language } = useLanguage();

  const getName = (item: { nameEn: string; nameFr: string; nameAr: string }) =>
    language === "fr" ? item.nameFr : language === "ar" ? item.nameAr : item.nameEn;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-white/8 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-serif text-white">Your Order</h2>
                {totalItems > 0 && (
                  <span className="text-xs bg-primary text-black font-bold px-2 py-0.5 rounded-full leading-5">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
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
                          <p className="text-xs text-gray-500 mt-0.5">= {formatDA(itemTotal)}</p>
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/8 space-y-4 bg-[#0a0a0a]">
                <div className="space-y-2">
                  {items.map(item => {
                    const it = parsePrice(item.price) * item.quantity;
                    if (it === 0) return null;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs text-gray-500">
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
                  onClick={() => { setIsOpen(false); onCheckout(); }}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm transition-colors"
                >
                  Place Order
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
