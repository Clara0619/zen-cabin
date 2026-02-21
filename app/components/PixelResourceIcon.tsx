"use client";

import type { ResourceType } from "@/types/game";

/** 16x16 像素风格资源图标：树木(绿冠+棕干)、石头(灰块)、浆果(粉点) */
export function PixelResourceIcon({
  type,
  className = "w-8 h-8",
}: {
  type: ResourceType;
  className?: string;
}) {
  if (type === "wood") {
    return (
      <span className={`inline-block ${className} relative`}>
        {/* 树干 */}
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 border-2 border-zen-border rounded-none"
          style={{ backgroundColor: "#5d4037" }}
        />
        {/* 树冠 像素块 */}
        <span
          className="absolute top-0 left-0 right-0 h-2/3 border-2 border-zen-border rounded-none"
          style={{ backgroundColor: "#88B04B", boxShadow: "inset 0 0 0 2px #6b8e23" }}
        />
      </span>
    );
  }
  if (type === "stone") {
    return (
      <span
        className={`inline-block ${className} border-2 border-zen-border rounded-none`}
        style={{
          backgroundColor: "#6B7B8C",
          boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.2), inset -2px -2px 0 rgba(0,0,0,0.2)",
        }}
      />
    );
  }
  if (type === "food") {
    return (
      <span
        className={`inline-block ${className} border-2 border-zen-border rounded-none`}
        style={{
          backgroundColor: "#F7CAC9",
          boxShadow: "inset 0 0 0 2px #e8a0a0",
        }}
      />
    );
  }
  return null;
}
