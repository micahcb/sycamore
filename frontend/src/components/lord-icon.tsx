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
  className?: string;
  size?: number;
  colors?: string;
}

export function LordIcon({
  src,
  trigger = "hover",
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
      colors={colors}
      className={cn("shrink-0 current-color", className)}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
