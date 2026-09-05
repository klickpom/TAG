import { motion, useReducedMotion } from "framer-motion";

type BrandMarkProps = {
  size?: "nav" | "footer";
  tone?: "light" | "dark";
  caption?: boolean;
};

export default function BrandMark({
  size = "nav",
  tone = "light",
  caption = true,
}: BrandMarkProps) {
  const reduce = useReducedMotion();
  const tall =
    size === "footer"
      ? "h-[5rem] sm:h-[5.75rem]"
      : "h-[4.15rem] sm:h-[4.75rem] md:h-[5.25rem]";

  return (
    <span className="flex min-w-0 items-center gap-2 sm:gap-3">
      <motion.span
        tabIndex={-1}
        className={`taj-mark relative ${tall} aspect-[560/538] shrink-0 ${tone === "dark" ? "taj-mark-on-dark" : "taj-mark-on-light"}`}
        initial={reduce ? false : { opacity: 0, y: 10, scale: 0.92 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
      >
        <span className={`taj-mark-stage${reduce ? "" : " taj-mark-float"}`}>
          <span className="taj-mark-glow" aria-hidden />
          <img
            src="/images/taj-mark.png"
            alt="شعار مصنع تاج لساعات الحائط والديكور"
            className="taj-mark-img"
            draggable={false}
          />
          {reduce ? null : <span className="taj-mark-sheen" aria-hidden />}
        </span>
      </motion.span>
      {caption ? (
        <span
          className={`min-w-0 leading-tight ${size === "nav" ? "hidden sm:block" : ""} ${
            tone === "dark" ? "text-[#d9cbb0]" : "text-[#7a6f60]"
          }`}
        >
          <span className="block truncate text-[10px] font-semibold sm:text-[11px] md:whitespace-normal">
            مصنع تاج لساعات الحائط والديكور
          </span>
        </span>
      ) : null}
    </span>
  );
}
