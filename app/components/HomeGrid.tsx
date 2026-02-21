"use client";

import { motion } from "framer-motion";
import { Home, Star } from "lucide-react";
import type { GridCell } from "@/types/game";
import type { GameState } from "@/hooks/useGameState";
import { GRID_SIZE } from "@/types/game";
import { PixelResourceIcon } from "./PixelResourceIcon";
import { BuildingIcon } from "./BuildingIcon";

type HomeGridProps = {
  grid: GridCell[][];
  selectedBuildingForPlace: GameState["selectedBuildingForPlace"];
  onCellClick: (row: number, col: number) => void;
  pendingBuildings?: GameState["pendingBuildings"];
  inventory?: { wood: number; stone: number; food: number };
};

const cellSize = "2.75rem";

export function HomeGrid({
  grid,
  selectedBuildingForPlace,
  onCellClick,
  pendingBuildings = [],
  inventory = { wood: 0, stone: 0, food: 0 },
}: HomeGridProps) {
  return (
    <div className="flex gap-2 items-stretch relative z-10">
      <div className="pixel-box-8 p-2 grass-bg border-8 border-zen-border rounded-none flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-6 h-6 flex items-center justify-center border-2 border-zen-border rounded-none bg-amber-800">
            <Home className="w-3 h-3 text-amber-200" />
          </span>
          <span className="text-sm text-zen-border font-bold">HOME GRID</span>
          {selectedBuildingForPlace && (
            <span className="text-amber-400" title="选择格子放置">
              <Star className="w-4 h-4 fill-amber-400" />
            </span>
          )}
        </div>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize})`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize})`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <GridCellButton
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isSelectedMode={!!selectedBuildingForPlace}
                onPlace={() => onCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <div className="pixel-box-8 p-1.5 border-8 border-zen-border rounded-none bg-[#e8e0c8]">
          <p className="text-xs text-zen-border mb-1">待放置</p>
          <div className="grid grid-cols-2 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 border-2 border-zen-border rounded-none flex items-center justify-center bg-amber-100"
              >
                {pendingBuildings[i] ? (
                  <BuildingIcon type={pendingBuildings[i]} className="w-8 h-8" />
                ) : (
                  <span className="text-zen-border/30 text-xs">空</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="pixel-box-8 p-1.5 border-8 border-zen-border rounded-none bg-[#e8e0c8]">
          <p className="text-xs text-zen-border mb-1">资源</p>
          <div className="grid grid-cols-2 gap-1">
            <div className="w-10 h-10 flex flex-col items-center justify-center border-2 border-zen-border rounded-none bg-white">
              <PixelResourceIcon type="wood" className="w-5 h-5" />
              <span className="text-[10px]">{inventory.wood}</span>
            </div>
            <div className="w-10 h-10 flex flex-col items-center justify-center border-2 border-zen-border rounded-none bg-white">
              <PixelResourceIcon type="stone" className="w-5 h-5" />
              <span className="text-[10px]">{inventory.stone}</span>
            </div>
            <div className="w-10 h-10 flex flex-col items-center justify-center border-2 border-zen-border rounded-none bg-white col-span-2">
              <PixelResourceIcon type="food" className="w-5 h-5" />
              <span className="text-[10px]">浆果 {inventory.food}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GridCellButton({
  cell,
  row,
  col,
  isSelectedMode,
  onPlace,
}: {
  cell: GridCell;
  row: number;
  col: number;
  isSelectedMode: boolean;
  onPlace: () => void;
}) {
  const hasBuilding = cell.building !== null;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500 }}
      onClick={onPlace}
      className={`
        w-full h-full border-4 border-zen-border flex items-center justify-center relative
        ${hasBuilding ? "brick-cell bg-zen-wood/30" : "brick-cell"}
        ${isSelectedMode && !hasBuilding ? "ring-2 ring-amber-400 ring-offset-1" : ""}
      `}
      style={{ minWidth: cellSize, minHeight: cellSize }}
    >
      {hasBuilding ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="inline-flex items-center justify-center w-full h-full"
          style={{ fontSize: "2rem" }}
        >
          <BuildingIcon type={cell.building!} className="w-[2rem] h-[2rem] min-w-[2rem] min-h-[2rem]" />
        </motion.span>
      ) : (
        <span className="text-[10px] text-zen-border/40">{row},{col}</span>
      )}
    </motion.button>
  );
}
