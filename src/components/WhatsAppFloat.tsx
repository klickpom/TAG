import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WA_LINK } from "./TopBar";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل واتساب"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-[#25d366]/30 transition-transform hover:scale-110 sm:bottom-6 sm:left-6"
    >
      <motion.span
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#25d366]"
      />
      <MessageCircle className="relative h-7 w-7" />
    </motion.a>
  );
}
