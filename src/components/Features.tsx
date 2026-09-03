import { motion } from "framer-motion";
import { BadgeCheck, HandCoins, PackageCheck, Truck } from "lucide-react";

const FEATURES = [
  { icon: BadgeCheck, title: "جودة مصنع مباشرة", text: "منتجاتنا من مصنعنا في طنطا مباشرة — بدون وسطاء." },
  { icon: HandCoins, title: "دفع عند الاستلام", text: "ادفع لما توصلك المنتج وتتأكد من جودته بنفسك." },
  { icon: Truck, title: "شحن لكل المحافظات", text: "نوصل لباب بيتك أينما كنت في مصر خلال أيام." },
  { icon: PackageCheck, title: "تغليف آمن", text: "تغليف احترافي مقوّى يحمي المنتجات القابلة للكسر حتى الاستلام." },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#faf6ef] py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group min-w-0 rounded-2xl border border-[#eadfc9] bg-white p-5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#c6a15b]/10 sm:p-6"
          >
            <div className="bg-gold-gradient flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md shadow-[#c6a15b]/30 transition-transform group-hover:scale-110">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#191920]">{f.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#7a6f60]">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
