"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ResourceType } from "@/types/game";
import { PixelResourceIcon } from "./PixelResourceIcon";

type ResourceAreaProps = {
  canGather: boolean;
  onGather: (resource: ResourceType) => void;
};

const resources: { type: ResourceType; label: string }[] = [
  { type: "wood", label: "树木" },
  { type: "stone", label: "石头" },
  { type: "food", label: "浆果" },
];

export function ResourceArea({ canGather, onGather }: ResourceAreaProps) {
  const [shakeTree, setShakeTree] = useState(false);

  return (
    <div className="pixel-box-8 p-4 bg-white border-8 border-zen-border rounded-none flex flex-col gap-3 relative z-10">
      <p className="text-sm text-zen-border">采集 · 消耗体力</p>
      <div className="flex flex-col gap-2">
        {resources.map(({ type, label }) => {
          const isTree = type === "wood";
          return (
            <motion.button
              key={type}
              type="button"
              whileTap={isTree ? undefined : { scale: 0.95 }}
              animate={
                isTree && shakeTree
                  ? { rotate: [0, -14, 14, -14, 14, 0], x: [0, 2, -2, 2, -2, 0] }
                  : {}
              }
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              onAnimationComplete={isTree ? () => setShakeTree(false) : undefined}
              onClick={() => {
                onGather(type);
                if (isTree && canGather) setShakeTree(true);
              }}
              disabled={!canGather}
              className={`pixel-btn flex items-center gap-3 px-4 py-3 border-4 border-zen-border rounded-none ${
                canGather ? "bg-white" : "bg-gray-300 opacity-70 cursor-not-allowed"
              }`}
            >
              <PixelResourceIcon type={type} className="w-10 h-10 shrink-0" />
              <span className="text-sm text-zen-border">{label}</span>
            </motion.button>
          );
        })}
      </div>
      {!canGather && (
        <p className="text-xs text-zen-border/80">
          体力不足 · 每5秒+1 或 进食浆果
        </p>
      )}
    </div>
  );
}
