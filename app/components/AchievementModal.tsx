"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";

type AchievementModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
};

export function AchievementModal({
  open,
  onClose,
  title,
  subtitle = "摆满 5 个建筑解锁",
}: AchievementModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[min(92vw,280px)] pixel-box border-4 border-zen-border bg-zen-bg p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-none border-4 border-amber-500 bg-amber-100"
            >
              <Award className="w-8 h-8 text-amber-600" />
            </motion.div>
            <p className="text-[10px] text-zen-border/70 mb-1">{subtitle}</p>
            <p className="text-sm text-zen-border font-bold mb-4">{title}</p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="pixel-btn px-4 py-2 bg-zen-wood text-white text-xs"
            >
              太棒了
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
