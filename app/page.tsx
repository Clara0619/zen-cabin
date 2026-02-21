"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { PixelClouds } from "./components/PixelClouds";
import { GameHUD } from "./components/GameHUD";
import { HomeGrid } from "./components/HomeGrid";
import { ResourceArea } from "./components/ResourceArea";
import { CraftingMenu } from "./components/CraftingMenu";
import { AchievementModal } from "./components/AchievementModal";
import { FlashRecipeOverlay } from "./components/FlashRecipeOverlay";
import { GameOverPanel } from "./components/GameOverPanel";

export default function Home() {
  const game = useGameState();
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementShown, setAchievementShown] = useState(false);
  const [showSeasonChange, setShowSeasonChange] = useState(false);
  const [prevReversed, setPrevReversed] = useState(game.isReversedRule);

  useEffect(() => {
    if (game.isReversedRule !== prevReversed && game.successfulBuildCount > 0) {
      setShowSeasonChange(true);
      setPrevReversed(game.isReversedRule);
      const t = setTimeout(() => setShowSeasonChange(false), 3500);
      return () => clearTimeout(t);
    }
  }, [game.isReversedRule, game.successfulBuildCount, prevReversed]);

  useEffect(() => {
    if (game.placedBuildingCount >= 5 && !achievementShown) {
      setShowAchievement(true);
      setAchievementShown(true);
    }
  }, [game.placedBuildingCount, achievementShown]);

  return (
    <main className="min-h-screen flex flex-col bg-[#6B8EFF]">
      <PixelClouds />

      <AnimatePresence>
        {showSeasonChange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 pointer-events-none"
          >
            <span className="pixel-box-8 px-8 py-4 bg-yellow-400 border-8 border-zen-border text-zen-border text-[14px] sm:text-[16px]">
              SEASON CHANGE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <FlashRecipeOverlay show={game.recipeVisible} recipe={game.currentRecipe} />

      {game.gameOver && (
        <GameOverPanel
          score={game.score}
          finalLogicLoad={game.finalLogicLoad || game.logicLoadPercent}
          placedBuildingCount={game.placedBuildingCount}
        />
      )}

      <AchievementModal
        open={showAchievement}
        onClose={() => setShowAchievement(false)}
        title="前额叶指挥官：初级"
        subtitle="摆满 5 个建筑解锁"
      />

      <div className="relative z-10 p-2">
        <GameHUD
          score={game.score}
          timeLeft={game.timeLeft}
          logicLoadPercent={game.logicLoadPercent}
          heartsFilled={game.heartsFilled}
          hpHearts={game.hpHearts}
          wood={game.inventory.wood}
          stone={game.inventory.stone}
          food={game.inventory.food}
          canEatFood={game.canEatFood}
          onEatFood={game.eatFood}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 p-3 min-h-0">
        <section className="flex flex-col items-start min-w-0">
          <HomeGrid
            grid={game.grid}
            selectedBuildingForPlace={game.selectedBuildingForPlace}
            onCellClick={game.placeBuilding}
            pendingBuildings={game.pendingBuildings}
            inventory={game.inventory}
          />
        </section>
        <aside className="w-full lg:w-52 shrink-0">
          <ResourceArea canGather={game.canGather} onGather={game.gather} />
        </aside>
      </div>

      <footer className="p-3 border-t-8 border-zen-border bg-zen-brick/30">
        <CraftingMenu
          craftSlots={game.craftSlots}
          currentRecipe={game.currentRecipe}
          recipeVisible={game.recipeVisible}
          isReversedRule={game.isReversedRule}
          craftFeedback={game.craftFeedback}
          pendingBuildings={game.pendingBuildings}
          selectedBuildingForPlace={game.selectedBuildingForPlace}
          inventory={game.inventory}
          putCraftSlot={game.putCraftSlot}
          removeFromCraftSlot={game.removeFromCraftSlot}
          tryCraft={game.tryCraft}
          selectBuildingToPlace={game.selectBuildingToPlace}
          startFlashMemory={game.startFlashMemory}
          onFakeResourceClick={game.onFakeResourceClick}
          memorySecondsLeft={game.memorySecondsLeft}
          gameOver={game.gameOver}
        />
      </footer>
    </main>
  );
}
