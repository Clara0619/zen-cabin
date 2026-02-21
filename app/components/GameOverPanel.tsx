"use client";

import { motion } from "framer-motion";

type GameOverPanelProps = {
  score: number;
  finalLogicLoad: number;
  placedBuildingCount: number;
};

/** TIME 到 0 时覆盖全屏的像素风结算面板，显示 LOGIC LOAD 评分 */
export function GameOverPanel({
  score,
  finalLogicLoad,
  placedBuildingCount,
}: GameOverPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="pixel-box-8 w-[min(92vw,360px)] p-8 bg-white border-8 border-zen-border rounded-none text-center"
      >
        <p className="text-base text-zen-border mb-4">GAME OVER</p>
        <p className="text-sm text-zen-border/80 mb-6">TIME&apos;S UP</p>
        <div className="space-y-3 mb-6">
          <p className="text-sm text-zen-border">
            LOGIC LOAD: <strong>{Math.round(finalLogicLoad)}%</strong>
          </p>
          <p className="text-sm text-zen-border/80">SCORE: {score}</p>
          <p className="text-sm text-zen-border/80">建筑数: {placedBuildingCount}</p>
        </div>
        <p className="text-xs text-zen-border/60">
          前额叶训练完成 · 刷新页面再玩一局
        </p>
      </motion.div>
    </motion.div>
  );
}
