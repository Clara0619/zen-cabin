"use client";

import { motion } from "framer-motion";
import type { Recipe } from "@/types/game";
import { PixelResourceIcon } from "./PixelResourceIcon";

type FlashRecipeOverlayProps = {
  show: boolean;
  recipe: Recipe | null;
};

/** 点击「查看配方」后全屏显示当前目标配方图标序列，3 秒后自动隐藏；显示期间底部「合成」禁用 */
export function FlashRecipeOverlay({ show, recipe }: FlashRecipeOverlayProps) {
  if (!show || !recipe) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 border-0 rounded-none"
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-lg text-white">记住顺序 · 3 秒后隐藏</p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {recipe.sequence.map((res, i) => (
            <motion.span
              key={`${i}-${res}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: i * 0.06 }}
            >
              <PixelResourceIcon type={res} className="w-16 h-16 sm:w-20 sm:h-20" />
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
