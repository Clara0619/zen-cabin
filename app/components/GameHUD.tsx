"use client";

import { motion } from "framer-motion";
import { Heart, Axe, Package } from "lucide-react";
import { PixelResourceIcon } from "./PixelResourceIcon";
import type { ResourceType } from "@/types/game";

type GameHUDProps = {
  score: number;
  timeLeft: number;
  logicLoadPercent: number;
  heartsFilled: number;
  hpHearts: number;
  wood: number;
  stone: number;
  food: number;
  canEatFood: boolean;
  onEatFood: () => void;
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** 参考图：Resource Overlay — 一排像素图标，下方文字 */
export function GameHUD({
  score,
  timeLeft,
  logicLoadPercent,
  heartsFilled,
  hpHearts,
  wood,
  stone,
  food,
  canEatFood,
  onEatFood,
}: GameHUDProps) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="pixel-box-8 rounded-none relative z-10 border-8 border-zen-border bg-[#e8e0c8] px-3 py-2"
    >
      <p className="text-sm text-zen-border mb-1.5 font-bold">RESOURCE OVERLAY</p>
      {/* 一排像素图标：木 · 心 · 斧 · 浆果 · 石 · 箱 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1">
            <PixelResourceIcon type="wood" className="w-10 h-10" />
            <span className="text-xs text-zen-border">WOOD</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: hpHearts }).map((_, i) => (
                <span
                  key={i}
                  className="w-4 h-4 flex items-center justify-center border-2 border-zen-border rounded-none"
                  style={{
                    backgroundColor: i < heartsFilled ? "#e74c3c" : "#ccc",
                  }}
                >
                  {i < heartsFilled && <Heart className="w-2 h-2 text-white fill-white" />}
                </span>
              ))}
            </div>
            <span className="text-xs text-zen-border">HP</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="w-10 h-10 flex items-center justify-center border-2 border-zen-border rounded-none bg-amber-700">
              <Axe className="w-5 h-5 text-amber-200" />
            </span>
            <span className="text-xs text-zen-border">-5</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PixelResourceIcon type="food" className="w-10 h-10" />
            <span className="text-xs text-zen-border">FOOD</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PixelResourceIcon type="stone" className="w-10 h-10" />
            <span className="text-xs text-zen-border">STONE</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="w-10 h-10 flex items-center justify-center border-2 border-zen-border rounded-none bg-amber-800">
              <Package className="w-5 h-5 text-amber-200" />
            </span>
            <span className="text-xs text-zen-border">SCORE</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-zen-border flex-wrap">
          <span>HP: {heartsFilled}/{hpHearts}</span>
          <span>wood: {wood}</span>
          <span>food: {food}</span>
          <span>stone: {stone}</span>
          <span>进食 +25 HP</span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onEatFood}
            disabled={!canEatFood}
            className="pixel-btn px-2 py-1 border-2 text-xs disabled:opacity-50"
          >
            进食 +HP
          </motion.button>
        </div>
      </div>
      <div className="flex gap-4 mt-1.5 text-xs text-zen-border">
        <span>TIME: {formatTime(timeLeft)}</span>
        <span>LOGIC LOAD: {Math.round(logicLoadPercent)}%</span>
        <span>SCORE: {score}</span>
      </div>
    </motion.header>
  );
}
