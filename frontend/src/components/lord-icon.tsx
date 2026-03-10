"use client";

import { useEffect } from "react";
import { defineElement } from "@lordicon/element";
import { cn } from "@/lib/utils";

let elementDefined = false;

function ensureLordIconElement() {
  if (typeof window === "undefined" || elementDefined) return;
  defineElement();
  elementDefined = true;
}

export interface LordIconProps {
  src: string;
  trigger?: "hover" | "click" | "loop" | "in" | "morph" | "boomerang" | "sequence" | "loop-on-hover";
  /** CSS selector for the element that receives hover (e.g. parent link). When set, icon animates on that element's hover. */
  target?: string;
  className?: string;
  size?: number;
  colors?: string;
}

export function LordIcon({
  src,
  trigger = "hover",
  target,
  className,
  size = 24,
  colors,
}: LordIconProps) {
  useEffect(() => {
    ensureLordIconElement();
  }, []);

  return (
    <lord-icon
      src={src}
      trigger={trigger}
      target={target}
      colors={colors}
      className={cn("shrink-0 current-color", className)}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
