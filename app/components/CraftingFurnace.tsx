"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TreeDeciduous, Mountain, Cherry, Flame, BookOpen } from "lucide-react";
import type { CraftSlotItem } from "@/types/game";
import type { GameState } from "@/hooks/useGameState";
import { RecipeBookModal } from "./RecipeBookModal";

type CraftingFurnaceProps = {
  craftSlots: [CraftSlotItem, CraftSlotItem, CraftSlotItem];
  pendingBuildings: GameState["pendingBuildings"];
  selectedBuildingForPlace: GameState["selectedBuildingForPlace"];
  putCraftSlot: GameState["putCraftSlot"];
  removeFromCraftSlot: GameState["removeFromCraftSlot"];
  tryCraft: GameState["tryCraft"];
  selectBuildingToPlace: GameState["selectBuildingToPlace"];
  inventory: GameState["inventory"];
};

const slotIcons = {
  wood: TreeDeciduous,
  stone: Mountain,
  food: Cherry,
};

const buildingLabels: Record<string, string> = {
  cabin: "小木屋",
  fence: "栅栏",
  well: "水井",
  quarry: "石矿",
};

export function CraftingFurnace({
  craftSlots,
  pendingBuildings,
  selectedBuildingForPlace,
  putCraftSlot,
  removeFromCraftSlot,
  tryCraft,
  selectBuildingToPlace,
  inventory,
}: CraftingFurnaceProps) {
  const [recipeBookOpen, setRecipeBookOpen] = useState(false);
  const canCraft = craftSlots.every((s) => s !== null);

  return (
    <div className="flex items-start gap-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setRecipeBookOpen(true)}
        className="pixel-btn p-2 bg-zen-bg border-4 border-zen-border shrink-0"
        title="配方书"
      >
        <BookOpen className="w-5 h-5 text-zen-border" />
      </motion.button>
      <RecipeBookModal open={recipeBookOpen} onClose={() => setRecipeBookOpen(false)} />
      <div className="pixel-box p-4 bg-zen-bgDark border-4 border-zen-border flex flex-col gap-4 flex-1">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-xs text-white">合成炉 · 按顺序放入</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {([0, 1, 2] as const).map((idx) => (
          <CraftSlot
            key={idx}
            item={craftSlots[idx]}
            index={idx}
            onRemove={removeFromCraftSlot}
          />
        ))}
        <div className="flex gap-1 ml-2">
          {(["wood", "stone", "food"] as const).map((res) => {
            const firstEmpty = craftSlots.findIndex((s) => s === null);
            const canAdd = inventory[res] > 0 && firstEmpty !== -1;
            const Icon = slotIcons[res];
            const color = res === "wood" ? "#88B04B" : res === "stone" ? "#6B7B8C" : "#F7CAC9";
            return (
              <motion.button
                key={res}
                type="button"
                whileTap={{ scale: 0.9 }}
                disabled={!canAdd}
                onClick={() => canAdd && putCraftSlot(firstEmpty as 0 | 1 | 2, res)}
                className="pixel-btn w-10 h-10 flex items-center justify-center disabled:opacity-40"
                style={{ backgroundColor: `${color}40` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </motion.button>
            );
          })}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={tryCraft}
          disabled={!canCraft}
          className="pixel-btn px-4 py-2 bg-zen-wood text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          合成
        </motion.button>
      </div>
      {pendingBuildings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-white/80">待放置:</span>
          {pendingBuildings.map((b, i) => (
            <motion.button
              key={`${b}-${i}`}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => selectBuildingToPlace(selectedBuildingForPlace === b ? null : b)}
              className={`pixel-btn px-2 py-1 text-[10px] ${selectedBuildingForPlace === b ? "bg-zen-wood text-white" : "bg-white text-zen-border"}`}
            >
              {buildingLabels[b] ?? b}
            </motion.button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function CraftSlot({
  item,
  index,
  onRemove,
}: {
  item: CraftSlotItem;
  index: 0 | 1 | 2;
  onRemove: (idx: 0 | 1 | 2) => void;
}) {
  const Icon = item ? slotIcons[item] : null;
  const color = item === "wood" ? "#88B04B" : item === "stone" ? "#6B7B8C" : "#F7CAC9";

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 border-4 border-zen-border bg-zen-bg flex items-center justify-center cursor-pointer"
        onClick={() => item && onRemove(index)}
      >
        {Icon ? <Icon className="w-6 h-6" style={{ color }} /> : <span className="text-xs text-zen-border/50">空</span>}
      </motion.div>
      <span className="text-[10px] text-white/70">格 {index + 1}</span>
    </div>
  );
}
