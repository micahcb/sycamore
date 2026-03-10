"use client";

import { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";

const TREE_RIV_SRC = "/icons/tree.riv";

interface TreeIconProps {
  className?: string;
}

function RiveTreeIcon({ className }: TreeIconProps) {
  const { RiveComponent } = useRive({ src: TREE_RIV_SRC });
  return (
    <span className="inline-block transition-transform duration-200 ease-out group-hover:scale-110">
      <RiveComponent
        className={cn("inline-block h-8 w-8 shrink-0", className)}
        aria-hidden
      />
    </span>
  );
}

function FallbackTreeIcon({ className }: TreeIconProps) {
  return (
    <svg
      className={cn("inline-block shrink-0 transition-transform duration-200 ease-out group-hover:scale-110", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 4 6 14h3v6h6v-6h3L12 4Z" />
    </svg>
  );
}

export function TreeIcon({ className }: TreeIconProps) {
  const [useFallback, setUseFallback] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(TREE_RIV_SRC, { method: "HEAD" })
      .then((res) => setUseFallback(!res.ok))
      .catch(() => setUseFallback(true));
  }, []);

  if (useFallback === null) {
    return (
      <span
        className={cn("inline-block h-8 w-8 shrink-0 animate-pulse rounded bg-muted", className)}
        aria-hidden
      />
    );
  }

  if (useFallback) {
    return <FallbackTreeIcon className={className} />;
  }

  return <RiveTreeIcon className={className} />;
}
