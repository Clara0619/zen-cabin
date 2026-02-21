"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ResourceType,
  type BuildingType,
  type GridCell,
  type Inventory,
  type CraftSlotItem,
  type Recipe,
  DEFAULT_INVENTORY,
  MAX_STAMINA,
  INITIAL_STAMINA,
  GATHER_STAMINA_COST,
  FOOD_STAMINA_RESTORE,
  STAMINA_REGEN_INTERVAL_MS,
  STAMINA_REGEN_AMOUNT,
  GRID_SIZE,
  RECIPES_LIBRARY,
  FLASH_RECIPE_DURATION_MS,
  MEMORY_DEADLINE_MS,
  BUILD_COUNT_FOR_RULE_REVERSE,
  ROUND_TIME_MS,
  CRAFT_FAIL_STAMINA_PENALTY,
  FAKE_RESOURCE_STAMINA_PENALTY,
  validateCrafting,
  getRecipeSlotCount,
  pickRecipeByLength,
} from "@/types/game";

type Grid = GridCell[][];

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ building: null }))
  );
}

function createEmptySlots(len: number): CraftSlotItem[] {
  return Array.from({ length: len }, () => null);
}

export function useGameState() {
  const [inventory, setInventory] = useState<Inventory>(() => ({ ...DEFAULT_INVENTORY }));
  const [stamina, setStamina] = useState(INITIAL_STAMINA);
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_MS);

  /** 当前要记忆的配方 */
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(() => RECIPES_LIBRARY[0]);
  const [craftSlots, setCraftSlots] = useState<CraftSlotItem[]>(() =>
    createEmptySlots(getRecipeSlotCount(RECIPES_LIBRARY[0]))
  );
  /** 配方是否正在全屏显示（记忆闪烁 3s），此期间禁用「合成」 */
  const [recipeVisible, setRecipeVisible] = useState(false);
  const [memoryStartTime, setMemoryStartTime] = useState<number | null>(null);
  const [memoryDeadlinePassed, setMemoryDeadlinePassed] = useState(false);

  /** 季节更替：每建造 2 栋后逆序匹配 */
  const [isReversedRule, setIsReversedRule] = useState(false);
  const [successfulBuildCount, setSuccessfulBuildCount] = useState(0);

  const [pendingBuildings, setPendingBuildings] = useState<BuildingType[]>([]);
  const [selectedBuildingForPlace, setSelectedBuildingForPlace] = useState<BuildingType | null>(null);
  const [craftFeedback, setCraftFeedback] = useState<"idle" | "success" | "fail">("idle");

  /** 游戏结束：TIME 到 0 时设为 true，停止所有交互 */
  const [gameOver, setGameOver] = useState(false);
  /** 结算时快照的 LOGIC LOAD（用于结算面板） */
  const [finalLogicLoad, setFinalLogicLoad] = useState(0);

  const logicLoadPercent = useMemo(() => {
    if (!currentRecipe) return 0;
    let load = 20 + currentRecipe.level * 25;
    if (isReversedRule) load += 25;
    if (memoryStartTime !== null && !memoryDeadlinePassed) load += 20;
    return Math.min(100, load);
  }, [currentRecipe, isReversedRule, memoryStartTime, memoryDeadlinePassed]);

  /** 体力自动回复（游戏未结束时） */
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setStamina((s) => Math.min(MAX_STAMINA, s + STAMINA_REGEN_AMOUNT));
    }, STAMINA_REGEN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [gameOver]);

  /** 倒计时；到 0 时停止 */
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  /** TIME 到 0 时触发游戏结束 */
  useEffect(() => {
    if (timeLeft === 0) setGameOver(true);
  }, [timeLeft]);

  /** 游戏结束时快照 LOGIC LOAD 用于结算面板 */
  useEffect(() => {
    if (gameOver) setFinalLogicLoad((prev) => (prev === 0 ? logicLoadPercent : prev));
  }, [gameOver, logicLoadPercent]);

  /** 记忆期限剩余秒数（每秒更新，供 CraftingStation 显示） */
  const [memorySecondsLeft, setMemorySecondsLeft] = useState<number | null>(null);

  /** 记忆期限 10s：超时清空槽位并退还资源；同时刷新剩余秒数 */
  useEffect(() => {
    if (memoryStartTime === null || gameOver) {
      setMemorySecondsLeft(null);
      return;
    }
    const deadline = memoryStartTime + MEMORY_DEADLINE_MS;
    const tick = () => {
      const now = Date.now();
      const left = Math.ceil((deadline - now) / 1000);
      setMemorySecondsLeft(left > 0 ? left : 0);
      if (now >= deadline) {
        setMemoryDeadlinePassed(true);
        setMemoryStartTime(null);
        setCraftSlots((prev) => {
          setInventory((inv) => {
            const next = { ...inv };
            prev.forEach((s) => {
              if (s) next[s] = (next[s] ?? 0) + 1;
            });
            return next;
          });
          return createEmptySlots(prev.length);
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [memoryStartTime, gameOver]);

  const addResource = useCallback((type: ResourceType, amount: number = 1) => {
    setInventory((prev) => ({ ...prev, [type]: prev[type] + amount }));
  }, []);

  const spendStamina = useCallback((amount: number) => {
    setStamina((prev) => Math.max(0, prev - amount));
  }, []);

  const canGather = useMemo(
    () => !gameOver && stamina >= GATHER_STAMINA_COST,
    [gameOver, stamina]
  );

  const gather = useCallback(
    (resource: ResourceType) => {
      if (gameOver || !canGather) return;
      spendStamina(GATHER_STAMINA_COST);
      addResource(resource, 1);
    },
    [gameOver, canGather, spendStamina, addResource]
  );

  const canEatFood = useMemo(
    () => !gameOver && inventory.food >= 1 && stamina < MAX_STAMINA,
    [gameOver, inventory.food, stamina]
  );

  const eatFood = useCallback(() => {
    if (gameOver) return;
    setInventory((prev) => {
      if (prev.food < 1) return prev;
      setStamina((s) => Math.min(MAX_STAMINA, s + FOOD_STAMINA_RESTORE));
      return { ...prev, food: prev.food - 1 };
    });
  }, [gameOver]);

  /** 查看配方：全屏显示 3s 后隐藏，开始 10s 记忆期限；显示期间合成按钮禁用 */
  const startFlashMemory = useCallback(() => {
    if (gameOver) return;
    const recipe = currentRecipe ?? RECIPES_LIBRARY[0];
    setCurrentRecipe(recipe);
    setCraftSlots(createEmptySlots(getRecipeSlotCount(recipe)));
    setMemoryDeadlinePassed(false);
    setMemoryStartTime(null);
    setRecipeVisible(true);
  }, [gameOver, currentRecipe]);

  useEffect(() => {
    if (!recipeVisible || gameOver) return;
    const hide = () => {
      setRecipeVisible(false);
      setMemoryStartTime(Date.now());
    };
    const t = setTimeout(hide, FLASH_RECIPE_DURATION_MS);
    return () => clearTimeout(t);
  }, [recipeVisible, gameOver]);

  /** 仅当该格为空且背包有资源时才扣除并放入，避免连点重复扣资源 */
  const putCraftSlot = useCallback(
    (slotIndex: number, resource: ResourceType) => {
      if (gameOver) return;
      setCraftSlots((slots) => {
        if (slots[slotIndex] !== null) return slots;
        setInventory((inv) => {
          if (inv[resource] < 1) return inv;
          return { ...inv, [resource]: inv[resource] - 1 };
        });
        const next = [...slots];
        next[slotIndex] = resource;
        return next;
      });
    },
    [gameOver]
  );

  const removeFromCraftSlot = useCallback((slotIndex: number) => {
    if (gameOver) return;
    setCraftSlots((slots) => {
      const item = slots[slotIndex];
      if (item) setInventory((inv) => ({ ...inv, [item]: inv[item] + 1 }));
      const next = [...slots];
      next[slotIndex] = null;
      return next;
    });
  }, [gameOver]);

  /** 尝试合成：校验顺序/逆序（季节更替后为逆序），成功则下一配方长度随机增加 */
  const tryCraft = useCallback(() => {
    if (gameOver || !currentRecipe) return;
    if (craftSlots.length !== currentRecipe.sequence.length) return;
    const filled = craftSlots.every((s) => s !== null);
    if (!filled) return;

    const valid = validateCrafting(craftSlots, currentRecipe, isReversedRule);
    if (valid) {
      setCraftFeedback("success");
      setScore((s) => s + 100);
      setPendingBuildings((prev) => [...prev, currentRecipe.result]);
      setCraftSlots(createEmptySlots(currentRecipe.sequence.length));
      setMemoryStartTime(null);
      setTimeout(() => setCraftFeedback("idle"), 800);
    } else {
      setCraftFeedback("fail");
      spendStamina(CRAFT_FAIL_STAMINA_PENALTY);
      setCraftSlots(createEmptySlots(currentRecipe.sequence.length));
      setMemoryStartTime(null);
      setTimeout(() => setCraftFeedback("idle"), 600);
    }
  }, [gameOver, currentRecipe, craftSlots, isReversedRule, spendStamina]);

  const onFakeResourceClick = useCallback(() => {
    if (gameOver) return;
    spendStamina(FAKE_RESOURCE_STAMINA_PENALTY);
  }, [gameOver, spendStamina]);

  const selectBuildingToPlace = useCallback((building: BuildingType | null) => {
    if (gameOver) return;
    setSelectedBuildingForPlace(building);
  }, [gameOver]);

  /** 放置建筑：仅当格子为空时真正放置并消耗待放置、更新计数与下一配方（成功逻辑在 setGrid 内执行，避免异步导致误扣） */
  const placeBuilding = useCallback(
    (row: number, col: number) => {
      if (gameOver) return;
      const building = selectedBuildingForPlace;
      if (!building) return;
      const recipe = currentRecipe;
      setGrid((g) => {
        if (g[row][col].building !== null) return g;
        setPendingBuildings((prev) => {
          const idx = prev.indexOf(building);
          if (idx === -1) return prev;
          return prev.filter((_, i) => i !== idx);
        });
        setSelectedBuildingForPlace(null);
        setSuccessfulBuildCount((c) => {
          const next = c + 1;
          if (next > 0 && next % BUILD_COUNT_FOR_RULE_REVERSE === 0) {
            setIsReversedRule((r) => !r);
          }
          return next;
        });
        if (recipe) {
          const nextMinLen = Math.min(
            5,
            recipe.sequence.length + (Math.random() < 0.5 ? 1 : 0)
          );
          const nextRecipe = pickRecipeByLength(nextMinLen);
          setCurrentRecipe(nextRecipe);
          setCraftSlots(createEmptySlots(nextRecipe.sequence.length));
        }
        return g.map((r, ri) =>
          r.map((c, ci) => (ri === row && ci === col ? { ...c, building } : c))
        ) as Grid;
      });
    },
    [gameOver, selectedBuildingForPlace, currentRecipe]
  );

  const consumePendingBuilding = useCallback((building: BuildingType) => {
    setPendingBuildings((prev) => {
      const idx = prev.indexOf(building);
      if (idx === -1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const placedBuildingCount = useMemo(
    () => grid.flat().filter((c) => c.building !== null).length,
    [grid]
  );

  const hpHearts = 5;
  const heartsFilled = Math.min(hpHearts, Math.ceil(stamina / (MAX_STAMINA / hpHearts)));

  return {
    inventory,
    stamina,
    maxStamina: MAX_STAMINA,
    grid,
    craftSlots,
    currentRecipe,
    recipeVisible,
    memoryStartTime,
    memoryDeadlinePassed,
    memorySecondsLeft,
    isReversedRule,
    successfulBuildCount,
    pendingBuildings,
    selectedBuildingForPlace,
    score,
    timeLeft,
    logicLoadPercent,
    craftFeedback,
    gameOver,
    finalLogicLoad,
    canGather,
    canEatFood,
    eatFood,
    addResource,
    spendResource: useCallback((type: ResourceType, amount: number = 1) => {
      setInventory((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - amount) }));
    }, []),
    spendStamina,
    gather,
    startFlashMemory,
    putCraftSlot,
    removeFromCraftSlot,
    tryCraft,
    onFakeResourceClick,
    selectBuildingToPlace,
    placeBuilding,
    consumePendingBuilding,
    placedBuildingCount,
    heartsFilled,
    hpHearts,
  };
}

export type GameState = ReturnType<typeof useGameState>;
