"use client";

import type { BuildingType } from "@/types/game";

type BuildingIconProps = {
  type: BuildingType;
  className?: string;
};

/** 统一尺寸的卡通建筑图标，网格与待放置区使用同一套；font-size 保证 em 与容器一致 */
function CartoonCabin({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block relative overflow-visible ${className ?? "w-10 h-10"}`}
      style={{ fontSize: "1em" }}
      title="小木屋"
    >
      <span className="absolute inset-0 flex flex-col items-center justify-end pb-[8%] text-[100%]">
        {/* 屋顶三角：用 em 相对当前容器字体，容器宽高一致时三角适中 */}
        <span
          className="absolute left-1/2 -translate-x-1/2 top-0 block"
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: "0.5em",
            borderRightWidth: "0.5em",
            borderBottomWidth: "0.44em",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "#8B4513",
          }}
        />
        {/* 屋身 */}
        <span
          className="w-[85%] h-[52%] rounded-b-sm border-2 border-zen-border block"
          style={{ backgroundColor: "#d4a574" }}
        />
      </span>
      {/* 门 */}
      <span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[22%] h-[28%] rounded-b border-2 border-zen-border block"
        style={{ backgroundColor: "#5d4037" }}
      />
      {/* 窗 */}
      <span className="absolute bottom-[32%] right-[18%] w-[16%] h-[18%] rounded border-2 border-zen-border bg-sky-300 block" />
    </span>
  );
}

function CartoonFence({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="栅栏">
      <span className="absolute inset-0 flex items-end justify-center gap-[6%] pb-[5%]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[18%] border-2 border-zen-border rounded-sm block"
            style={{ height: "70%", backgroundColor: "#8B7355" }}
          />
        ))}
      </span>
    </span>
  );
}

function CartoonWell({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="水井">
      <span className="absolute inset-0 flex flex-col items-center justify-end">
        <span className="w-[55%] h-[50%] rounded-t border-2 border-zen-border block" style={{ backgroundColor: "#6B7B8C" }} />
        <span className="w-[70%] h-[8%] border-2 border-zen-border block" style={{ backgroundColor: "#5d4037" }} />
      </span>
    </span>
  );
}

function CartoonQuarry({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="石矿">
      <span className="absolute inset-0 flex items-end flex-wrap justify-center gap-[4%] pb-[5%] px-[5%]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[26%] h-[35%] border-2 border-zen-border rounded-sm block"
            style={{ backgroundColor: "#7a8a9a" }}
          />
        ))}
      </span>
    </span>
  );
}

function CartoonGarden({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="花园">
      <span className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[30%] h-[25%] rounded border-2 border-zen-border block" style={{ backgroundColor: "#5d4037" }} />
      <span className="absolute bottom-[28%] left-[25%] w-[18%] h-[22%] rounded-full border-2 border-zen-border block bg-zen-wood" />
      <span className="absolute bottom-[32%] right-[28%] w-[14%] h-[18%] rounded-full border-2 border-zen-border block bg-zen-food" />
    </span>
  );
}

function CartoonTower({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="塔楼">
      <span className="absolute inset-0 flex flex-col items-center justify-end gap-0 pb-[5%]">
        <span className="w-[35%] h-[25%] border-2 border-zen-border rounded-t block" style={{ backgroundColor: "#8B7355" }} />
        <span className="w-[45%] h-[35%] border-2 border-zen-border block" style={{ backgroundColor: "#6B7B8C" }} />
        <span className="w-[55%] h-[30%] border-2 border-zen-border rounded-t block" style={{ backgroundColor: "#5d4037" }} />
      </span>
    </span>
  );
}

function CartoonShed({ className }: { className?: string }) {
  return (
    <span className={`inline-block relative ${className ?? "w-10 h-10"}`} title="棚屋">
      <span className="absolute inset-0 flex flex-col items-center justify-end pb-[5%]">
        <span className="w-[75%] h-[8%] border-2 border-zen-border block" style={{ backgroundColor: "#8B4513" }} />
        <span className="w-[80%] h-[55%] rounded-b-sm border-2 border-zen-border block" style={{ backgroundColor: "#a0826d" }} />
      </span>
    </span>
  );
}

/** 合成后的建筑：卡通图案（网格与待放置区使用相同组件，显示一致） */
export function BuildingIcon({ type, className = "w-10 h-10" }: BuildingIconProps) {
  const baseClass = className;
  switch (type) {
    case "cabin":
      return <CartoonCabin className={baseClass} />;
    case "fence":
      return <CartoonFence className={baseClass} />;
    case "well":
      return <CartoonWell className={baseClass} />;
    case "quarry":
      return <CartoonQuarry className={baseClass} />;
    case "garden":
      return <CartoonGarden className={baseClass} />;
    case "tower":
      return <CartoonTower className={baseClass} />;
    case "shed":
      return <CartoonShed className={baseClass} />;
    default:
      return (
        <span className={`inline-block ${baseClass} rounded-lg border-2 border-zen-border flex items-center justify-center bg-amber-200 text-[0.5em]`}>
          ?
        </span>
      );
  }
}
