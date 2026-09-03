import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { fmt } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { WA_NUMBER } from "./TopBar";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, clear, total, productOf } =
    useCart();

  const checkout = () => {
    const lines = items
      .map((i) => {
        const p = productOf(i.id);
        return p ? `• ${p.name} × ${i.qty} = ${fmt(p.price * i.qty)}` : "";
      })
      .filter(Boolean);
    const msg = `السلام عليكم 🌟\nأنا عايز أطلب من مصنع تاج:\n\n${lines.join(
      "\n"
    )}\n\nالإجمالي: ${fmt(total)}\n\nمن فضلكم أكّدوا الطلب والشحن. شكراً!`;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-[#faf6ef] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[#eadfc9] px-5 py-4">
              <h3 className="flex items-center gap-2 text-lg font-black text-[#191920]">
                <ShoppingBag className="h-5 w-5 text-[#c6a15b]" />
                سلة المشتريات
              </h3>
              <button
                onClick={closeCart}
                className="rounded-full bg-white p-2 text-[#191920] shadow-sm hover:bg-[#eadfc9]"
                aria-label="إغلاق السلة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* items */}
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a89a80]">
                  <ShoppingBag className="h-14 w-14" />
                  <p className="text-sm font-semibold">السلة فارغة… ابدأ التسوق!</p>
                </div>
              )}
              {items.map((i) => {
                const p = productOf(i.id);
                if (!p) return null;
                return (
                  <motion.div
                    key={i.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex gap-3 rounded-2xl border border-[#eadfc9] bg-white p-3 shadow-sm"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-bold text-[#191920]">
                          {p.name}
                        </h4>
                        <button
                          onClick={() => remove(i.id)}
                          className="text-[#b0574a] hover:text-red-600"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 rounded-full border border-[#eadfc9] px-2 py-1">
                          <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="أقل">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{i.qty}</span>
                          <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="أكثر">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-[#a8853f]">
                          {fmt(p.price * i.qty)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* footer */}
            {items.length > 0 && (
              <div className="border-t border-[#eadfc9] bg-white px-5 py-4">
                <div className="flex items-center justify-between text-base font-black text-[#191920]">
                  <span>الإجمالي</span>
                  <span className="text-[#a8853f]">{fmt(total)}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#a89a80]">
                  الشحن يتحدد حسب المحافظة — الدفع عند الاستلام
                </p>
                <button
                  onClick={checkout}
                  className="bg-gold-gradient mt-3 w-full rounded-full py-3.5 text-base font-black text-[#191920] shadow-lg shadow-[#c6a15b]/30 transition-transform hover:scale-[1.02]"
                >
                  إتمام الطلب عبر واتساب
                </button>
                <button
                  onClick={clear}
                  className="mt-2 w-full py-1 text-xs font-semibold text-[#a89a80] hover:text-[#b0574a]"
                >
                  تفريغ السلة
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
