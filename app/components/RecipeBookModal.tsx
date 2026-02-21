"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { RECIPES_LIBRARY } from "@/types/game";
import type { ResourceType, BuildingType } from "@/types/game";

const resourceLabels: Record<ResourceType, string> = {
  wood: "木",
  stone: "石",
  food: "果",
};

const buildingLabels: Record<BuildingType, string> = {
  cabin: "小木屋",
  fence: "栅栏",
  well: "水井",
  quarry: "石矿",
  garden: "花园",
  tower: "塔楼",
  shed: "棚屋",
  barn: "谷仓",
  mill: "磨坊",
  fort: "堡垒",
  shrine: "神龛",
  bridge: "桥",
  gate: "大门",
  lighthouse: "灯塔",
  villa: "别墅",
};

type RecipeBookModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RecipeBookModal({ open, onClose }: RecipeBookModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(90vw,320px)] pixel-box border-4 border-zen-border bg-zen-bg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs text-zen-border">
                <BookOpen className="w-4 h-4" />
                配方书
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="pixel-btn p-1"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <p className="text-[10px] text-zen-border/80 mb-3">按顺序放入，顺序错则失败</p>
            <ul className="space-y-2">
              {RECIPES_LIBRARY.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 border-2 border-zen-border/50 bg-white/50 text-[10px] text-zen-border"
                >
                  <span>
                    [{r.sequence.map((s) => resourceLabels[s]).join("+")}]
                  </span>
                  <span className="font-bold">=</span>
                  <span>{buildingLabels[r.result]}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
