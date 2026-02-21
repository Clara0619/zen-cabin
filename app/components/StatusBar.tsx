"use client";

import { motion } from "framer-motion";
import { TreeDeciduous, Mountain, Cherry, Heart, UtensilsCrossed } from "lucide-react";
import type { Inventory } from "@/types/game";

const iconClass = "w-4 h-4";

type StatusBarProps = {
  inventory: Inventory;
  stamina: number;
  maxStamina: number;
  canEatFood: boolean;
  onEatFood: () => void;
};

export function StatusBar({ inventory, stamina, maxStamina, canEatFood, onEatFood }: StatusBarProps) {
  const staminaPercent = Math.min(100, (stamina / maxStamina) * 100);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pixel-box flex items-center justify-between gap-4 px-4 py-3 bg-zen-bg border-4 border-zen-border rounded-none"
    >
      <div className="flex items-center gap-6">
        <span className="text-xs text-zen-border">资源</span>
        <div className="flex items-center gap-2">
          <TreeDeciduous className={iconClass} style={{ color: "#88B04B" }} />
          <span className="text-sm">{inventory.wood}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mountain className={iconClass} style={{ color: "#6B7B8C" }} />
          <span className="text-sm">{inventory.stone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cherry className={iconClass} style={{ color: "#F7CAC9" }} />
          <span className="text-sm">{inventory.food}</span>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onEatFood}
          disabled={!canEatFood}
          title="消耗 1 浆果，恢复 25 体力"
          className={`pixel-btn flex items-center gap-1 px-2 py-1 text-[10px] ${canEatFood ? "bg-zen-food/80 hover:bg-zen-food" : "bg-gray-300 cursor-not-allowed opacity-60"}`}
        >
          <UtensilsCrossed className="w-3 h-3" />
          进食
        </motion.button>
      </div>
      <div className="flex items-center gap-3">
        <Heart className={`${iconClass} text-red-400`} />
        <div className="w-32 h-5 border-4 border-zen-border bg-gray-200 overflow-hidden">
          <motion.div
            className="h-full bg-zen-stamina"
            initial={false}
            animate={{ width: `${staminaPercent}%` }}
            transition={{ type: "tween", duration: 0.3 }}
          />
        </div>
        <span className="text-xs">{stamina}/{maxStamina}</span>
      </div>
    </motion.header>
  );
}
