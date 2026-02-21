"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Flame, Hammer, HelpCircle, Settings } from "lucide-react";
import type { CraftSlotItem, ResourceType, Recipe } from "@/types/game";
import type { GameState } from "@/hooks/useGameState";
import { PixelResourceIcon } from "./PixelResourceIcon";
import { BuildingIcon } from "./BuildingIcon";
import { RECIPES_LIBRARY } from "@/types/game";

const resourceLabels: Record<ResourceType, string> = {
  wood: "木",
  stone: "石",
  food: "果",
};

const buildingLabels: Record<string, string> = {
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

type CraftingMenuProps = {
  craftSlots: CraftSlotItem[];
  currentRecipe: Recipe | null;
  recipeVisible: boolean;
  isReversedRule: boolean;
  craftFeedback: GameState["craftFeedback"];
  pendingBuildings: GameState["pendingBuildings"];
  selectedBuildingForPlace: GameState["selectedBuildingForPlace"];
  inventory: GameState["inventory"];
  putCraftSlot: GameState["putCraftSlot"];
  removeFromCraftSlot: (index: number) => void;
  tryCraft: GameState["tryCraft"];
  selectBuildingToPlace: GameState["selectBuildingToPlace"];
  startFlashMemory: GameState["startFlashMemory"];
  onFakeResourceClick: GameState["onFakeResourceClick"];
  memorySecondsLeft: number | null;
  gameOver: boolean;
};

export function CraftingMenu({
  craftSlots,
  currentRecipe,
  recipeVisible,
  isReversedRule,
  craftFeedback,
  pendingBuildings,
  selectedBuildingForPlace,
  inventory,
  putCraftSlot,
  removeFromCraftSlot,
  tryCraft,
  selectBuildingToPlace,
  startFlashMemory,
  onFakeResourceClick,
  memorySecondsLeft,
  gameOver,
}: CraftingMenuProps) {
  const [recipeBookOpen, setRecipeBookOpen] = useState(false);
  const slotCount = currentRecipe?.sequence.length ?? 3;
  const canCraft = craftSlots.length === slotCount && craftSlots.every((s) => s !== null);
  /** 显示期间禁用「合成」 */
  const canSubmitCraft = canCraft && !recipeVisible && !gameOver;

  useEffect(() => {
    if (craftFeedback === "success" && typeof window !== "undefined") {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } catch (_) {}
    }
  }, [craftFeedback]);
  const firstEmpty = craftSlots.findIndex((s) => s === null);

  return (
    <div className="flex items-stretch gap-2 relative z-10">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setRecipeBookOpen(true)}
        className="pixel-btn p-2 bg-white border-4 border-zen-border shrink-0"
        title="配方书"
      >
        <BookOpen className="w-5 h-5 text-zen-border" />
      </motion.button>

      <AnimatePresence>
        {recipeBookOpen && (
          <RecipeBookOverlay
            key="recipe-book"
            onClose={() => setRecipeBookOpen(false)}
            recipes={RECIPES_LIBRARY}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          boxShadow:
            craftFeedback === "fail"
              ? ["0 0 0 4px #0d0d0d", "0 0 0 8px #e74c3c", "0 0 0 4px #0d0d0d"]
              : "0 0 0 4px #0d0d0d",
          backgroundColor: craftFeedback === "fail" ? "#2d0000" : undefined,
        }}
        transition={{ duration: 0.15, repeat: craftFeedback === "fail" ? 2 : 0 }}
        className="pixel-box-8 flex-1 p-3 bg-[#3d3a35] border-8 border-zen-border rounded-none flex flex-col gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 flex items-center justify-center border-2 border-zen-border rounded-none bg-amber-800">
            <Hammer className="w-5 h-5 text-amber-200" />
          </span>
          <span className="text-sm text-amber-100">CRAFTING STATION</span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setRecipeBookOpen(true)}
            className="w-7 h-7 flex items-center justify-center border-2 border-zen-border rounded-none bg-zen-border/30 ml-auto"
            title="配方书"
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
        <p className="text-xs text-amber-200/90">
          采集 HP-5 · 进食 HP+25 · 顺序敏感 {isReversedRule && "· 已反转"}
        </p>

        {recipeVisible && currentRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-yellow-300 bg-black/50 p-2 border-2 border-yellow-400"
          >
            [{currentRecipe.sequence.map((r) => resourceLabels[r]).join("-")}] →{" "}
            {buildingLabels[currentRecipe.result]}
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {craftSlots.map((item, idx) => (
            <CraftSlot
              key={idx}
              item={item}
              index={idx}
              onRemove={() => removeFromCraftSlot(idx)}
            />
          ))}
          <span className="text-[6px] text-amber-200/70">→</span>
          <div className="flex gap-1 flex-wrap items-center">
            {(["wood", "stone", "food"] as const).map((res) => {
              const canAdd = inventory[res] > 0 && firstEmpty !== -1;
              return (
                <motion.button
                  key={res}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  disabled={!canAdd}
                  onClick={() => canAdd && putCraftSlot(firstEmpty, res)}
                  className="pixel-btn w-9 h-9 flex items-center justify-center disabled:opacity-40 border-2 border-zen-border rounded-none bg-[#2a2722]"
                  title={res}
                >
                  <PixelResourceIcon type={res} className="w-5 h-5" />
                </motion.button>
              );
            })}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={startFlashMemory}
              className="pixel-btn w-9 h-9 flex items-center justify-center border-2 border-zen-border rounded-none bg-zen-wood/80"
              title="查看配方"
            >
              <HelpCircle className="w-5 h-5 text-white" />
            </motion.button>
            <FakeResourceButton onTap={onFakeResourceClick} />
            {memorySecondsLeft !== null && (
              <span className="text-xs text-yellow-300 px-1">
                {memorySecondsLeft}s
              </span>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={tryCraft}
              disabled={!canSubmitCraft}
              className="pixel-btn w-9 h-9 flex items-center justify-center border-2 border-zen-border rounded-none bg-orange-600 disabled:opacity-50"
              title="合成"
            >
              <Flame className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {craftFeedback === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
          >
            <span className="text-yellow-400 text-[10px] z-10">✓ 成功!</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (Math.cos((i * 2 * Math.PI) / 5) * 24),
                  y: (Math.sin((i * 2 * Math.PI) / 5) * 24),
                  opacity: 0,
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 400 }}
                className="absolute w-1.5 h-1.5 bg-amber-400 border border-amber-600"
              />
            ))}
          </motion.div>
        )}

        {pendingBuildings.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-white/80">待放置:</span>
            {pendingBuildings.map((b, i) => (
              <motion.button
                key={`${b}-${i}`}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  selectBuildingToPlace(selectedBuildingForPlace === b ? null : b)
                }
                className={`pixel-btn p-1.5 border-4 flex items-center justify-center ${
                  selectedBuildingForPlace === b ? "bg-zen-wood" : "bg-white"
                }`}
              >
                <BuildingIcon type={b} className="w-8 h-8" />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function CraftSlot({
  item,
  index,
  onRemove,
}: {
  item: CraftSlotItem;
  index: number;
  onRemove: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500 }}
      className="w-10 h-10 brick-cell border-4 border-zen-border flex items-center justify-center cursor-pointer"
      onClick={() => item && onRemove()}
    >
      {item ? (
        <PixelResourceIcon type={item} className="w-6 h-6" />
      ) : (
        <span className="text-xs text-zen-border/50">空</span>
      )}
    </motion.div>
  );
}

function FakeResourceButton({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      type="button"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      onClick={onTap}
      className="pixel-btn w-9 h-9 flex items-center justify-center border-2 border-zen-border rounded-none bg-gray-600"
      title="虚假资源！点击扣体力"
    >
      <Settings className="w-5 h-5 text-gray-300" />
    </motion.button>
  );
}

function RecipeBookOverlay({
  onClose,
  recipes,
}: {
  onClose: () => void;
  recipes: Recipe[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="pixel-box-8 bg-white p-4 max-w-xs border-8 border-zen-border"
      >
        <p className="text-sm text-zen-border mb-2">配方书 · 顺序敏感</p>
        <ul className="space-y-1 text-xs text-zen-border">
          {recipes.map((r, i) => (
            <li key={i}>
              [{r.sequence.map((s) => resourceLabels[s]).join("-")}] →{" "}
              {buildingLabels[r.result]}
            </li>
          ))}
        </ul>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="pixel-btn mt-2 px-3 py-1.5 text-xs"
        >
          关闭
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
