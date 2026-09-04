import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS, ORDER_STEPS } from "@/lib/site";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-[#faf6ef] py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold tracking-[0.32em] text-[#a8853f]">HOW TO ORDER</p>
          <h2 className="mt-3 text-3xl font-black text-[#191920] sm:text-4xl">طريقة الطلب من مصنع تاج</h2>
          <ol className="mt-8 space-y-5">
            {ORDER_STEPS.map((step, i) => (
              <li key={step.name} className="flex gap-4">
                <span className="font-display text-2xl font-bold text-[#c6a15b]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-base font-black text-[#191920]">{step.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-[#5d554a]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-[0.32em] text-[#a8853f]">FAQ</p>
          <h2 className="mt-3 text-3xl font-black text-[#191920] sm:text-4xl">أسئلة شائعة عن مصنع تاج</h2>
          <div className="mt-8 divide-y divide-[#eadfc9] border-y border-[#eadfc9]">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-right"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-black text-[#191920] sm:text-base">{item.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#a8853f] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-sm leading-7 text-[#5d554a]">{item.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
