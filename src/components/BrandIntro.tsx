import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const KEY = "taj-intro-v1";

function shouldPlayIntro(reduce: boolean | null) {
  if (typeof window === "undefined") return false;
  const force = new URLSearchParams(window.location.search).has("intro");
  if (force) return true;
  if (reduce) return false;
  return !sessionStorage.getItem(KEY);
}

export default function BrandIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => shouldPlayIntro(false));

  const finish = useCallback(() => {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
  }, []);

  useEffect(() => {
    if (!shouldPlayIntro(!!reduce)) {
      setShow(false);
      return;
    }
    setShow(true);
  }, [reduce]);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(finish, 4500);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [show, finish]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-[#0b0b0f]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="افتتاح مصنع تاج"
          aria-modal="true"
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.22),transparent_58%)]" />
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.86, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-6 w-full max-w-sm"
          >
            <img
              src="/images/taj-logo-3d.jpg"
              alt=""
              className="w-full rounded-[1.6rem] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-[#c6a15b]/35"
            />
            <span className="taj-intro-sheen pointer-events-none absolute inset-0 rounded-[1.6rem]" />
          </motion.div>
          <p className="relative mt-6 text-sm font-bold tracking-[0.28em] text-[#e6c987]">TAJ</p>
          <p className="relative mt-1 text-xs font-semibold text-[#cfc7b4]">مصنع تاج — بسيون</p>
          <button
            type="button"
            onClick={finish}
            className="absolute text-xs font-semibold text-[#cfc7b4]/80 underline-offset-4 hover:text-[#e6c987] hover:underline [top:max(1rem,env(safe-area-inset-top))] [left:max(1rem,env(safe-area-inset-left))]"
          >
            تخطي
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
