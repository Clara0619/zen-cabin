/**
 * ZenCabin: Pixel Odyssey — 前额叶训练 · 8-bit 核心类型
 */

/** 资源类型 */
export type ResourceType = "wood" | "stone" | "food";

/** 建筑类型（合成产物） */
export type BuildingType =
  | "cabin"
  | "fence"
  | "well"
  | "quarry"
  | "garden"
  | "tower"
  | "shed"
  | "barn"
  | "mill"
  | "fort"
  | "shrine"
  | "bridge"
  | "gate"
  | "lighthouse"
  | "villa";

/** 合成槽位内容 */
export type CraftSlotItem = ResourceType | null;

/** 网格单格 */
export type GridCell = { building: BuildingType | null };

/** 背包 */
export type Inventory = Record<ResourceType, number>;

/** 配方：可变长度序列 → 建筑（前额叶工作记忆） */
export type Recipe = {
  sequence: ResourceType[];
  result: BuildingType;
  level: 1 | 2 | 3;
};

/** 多配方：3–5 步，增加难度 */
export const RECIPES_LIBRARY: Recipe[] = [
  { sequence: ["wood", "wood", "stone"], result: "cabin", level: 1 },
  { sequence: ["wood", "stone", "wood"], result: "fence", level: 1 },
  { sequence: ["stone", "stone", "stone"], result: "well", level: 1 },
  { sequence: ["wood", "food", "stone", "wood"], result: "quarry", level: 2 },
  { sequence: ["wood", "stone", "food", "wood"], result: "garden", level: 2 },
  { sequence: ["food", "stone", "wood", "stone", "food"], result: "tower", level: 3 },
  { sequence: ["stone", "wood", "food", "wood", "stone"], result: "shed", level: 3 },
];

export const DEFAULT_INVENTORY: Inventory = {
  wood: 0,
  stone: 0,
  food: 0,
};

export const MAX_STAMINA = 100;
export const INITIAL_STAMINA = 100;
export const GATHER_STAMINA_COST = 5;
export const FOOD_STAMINA_RESTORE = 25;
export const STAMINA_REGEN_INTERVAL_MS = 5000;
export const STAMINA_REGEN_AMOUNT = 1;

export const CRAFT_FAIL_STAMINA_PENALTY = 10;
export const FAKE_RESOURCE_STAMINA_PENALTY = 25;

/** 记忆闪烁：配方全屏显示时长 (ms) */
export const FLASH_RECIPE_DURATION_MS = 3000;

/** 记忆期限：隐藏配方后需在此时限内完成合成 (ms) */
export const MEMORY_DEADLINE_MS = 10000;

/** 每成功建造几栋建筑触发一次规则反转（SEASON CHANGE） */
export const BUILD_COUNT_FOR_RULE_REVERSE = 2;

/** 单局倒计时 (ms) */
export const ROUND_TIME_MS = 5 * 60 * 1000;

export const GRID_SIZE = 8;
export const MAX_CRAFT_SLOTS = 5;

/** 校验合成：顺序匹配或（季节更替后）逆序匹配 */
export function validateCrafting(
  slots: CraftSlotItem[],
  recipe: Recipe,
  isReversed: boolean
): boolean {
  const target = isReversed ? [...recipe.sequence].reverse() : recipe.sequence;
  if (slots.length !== target.length) return false;
  return slots.every((s, i) => s === target[i]);
}

export function getRecipeSlotCount(recipe: Recipe): number {
  return recipe.sequence.length;
}

/** 按目标长度筛选配方并随机选一个（下一任务难度递增） */
export function pickRecipeByLength(minLength: number): Recipe {
  const eligible = RECIPES_LIBRARY.filter((r) => r.sequence.length >= minLength);
  const chosen = eligible[Math.floor(Math.random() * eligible.length)];
  return chosen ?? RECIPES_LIBRARY[RECIPES_LIBRARY.length - 1];
}
